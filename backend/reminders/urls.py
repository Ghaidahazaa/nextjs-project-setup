from django.urls import path
from .views import AdherenceLogCreateView, RefillLogCreateView

urlpatterns = [
    path('reminder-response/', AdherenceLogCreateView.as_view(), name='reminder-response'),
    path('refill-log/', RefillLogCreateView.as_view(), name='refill-log'),
]
