from celery import shared_task
from django.utils import timezone
from datetime import timedelta
from medications.models import Medication
from backend.celery import app
import requests
import logging

logger = logging.getLogger(__name__)

FCM_SERVER_KEY = "your_fcm_server_key_here"
FCM_URL = "https://fcm.googleapis.com/fcm/send"

@app.task
def check_and_send_refill_alerts():
    today = timezone.now().date()
    meds = Medication.objects.filter(
        start_quantity__isnull=False,
        dose_quantity__isnull=False,
        times_per_day__isnull=False,
    )
    for med in meds:
        days_supply = med.start_quantity / (med.dose_quantity * med.times_per_day)
        depletion_date = med.start_date + timedelta(days=days_supply)
        days_left = (depletion_date - today).days
        if days_left <= 3:
            user = med.user
            fcm_tokens = user.fcm_tokens.all()
            for token_obj in fcm_tokens:
                payload = {
                    "to": token_obj.token,
                    "notification": {
                        "title": "Refill reminder",
                        "body": f"You’ll run out of {med.name} in {days_left} days.",
                    },
                    "data": {
                        "type": "refill_alert",
                        "medication_id": str(med.id),
                    },
                }
                send_push_notification.delay(token_obj.token, payload)

@shared_task(bind=True, max_retries=3, default_retry_delay=30)
def send_push_notification(self, fcm_token, payload):
    headers = {
        "Authorization": f"key={FCM_SERVER_KEY}",
        "Content-Type": "application/json",
    }
    try:
        response = requests.post(FCM_URL, json=payload, headers=headers)
        response.raise_for_status()
        resp_json = response.json()
        if resp_json.get("failure", 0) > 0:
            error = resp_json.get("results", [{}])[0].get("error")
            if error in ["NotRegistered", "InvalidRegistration"]:
                logger.warning(f"Invalid FCM token: {fcm_token}")
            raise Exception(f"FCM send failure: {error}")
        logger.info(f"Push sent to {fcm_token} with payload {payload}")
    except Exception as exc:
        logger.error(f"Failed to send push to {fcm_token}: {exc}")
        raise self.retry(exc=exc)
