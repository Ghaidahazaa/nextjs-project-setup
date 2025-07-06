from django.urls import path
from .views import MedicationListCreateView, MedicationDetailView

urlpatterns = [
    path('', MedicationListCreateView.as_view(), name='medication-list-create'),
    path('<int:pk>/', MedicationDetailView.as_view(), name='medication-detail'),
]
