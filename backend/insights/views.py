from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from django.utils.timezone import now, timedelta
from django.db.models import Count, Q
from reminders.models import AdherenceLog, SideEffectLog

class InsightsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        today = now().date()
        week_ago = today - timedelta(days=7)
        month_ago = today - timedelta(days=30)

        # Adherence counts
        total_doses = AdherenceLog.objects.filter(user=user).count()
        taken_doses = AdherenceLog.objects.filter(user=user, status='taken').count()
        adherence_score = (taken_doses / total_doses * 100) if total_doses > 0 else 0

        # Symptom trends (last 30 days)
        symptoms = SideEffectLog.objects.filter(user=user, date__gte=month_ago).values('symptom').annotate(count=Count('id')).order_by('-count')

        # Missed dose breakdown (last 30 days)
        missed_doses = AdherenceLog.objects.filter(user=user, status='skipped', datetime__date__gte=month_ago)
        missed_reasons = missed_doses.values('reason').annotate(count=Count('id')).order_by('-count')

        # Current streak (consecutive taken doses)
        # Simplified: count last consecutive taken doses
        logs = AdherenceLog.objects.filter(user=user).order_by('-datetime')
        streak = 0
        for log in logs:
            if log.status == 'taken':
                streak += 1
            else:
                break

        data = {
            "adherence_score": adherence_score,
            "symptom_trends": list(symptoms),
            "missed_dose_breakdown": list(missed_reasons),
            "current_streak": streak,
        }
        return Response(data)
