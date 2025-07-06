from django.urls import path
from .views import SideEffectLogCreateView

urlpatterns = [
    path('side-effect-log/', SideEffectLogCreateView.as_view(), name='side-effect-log'),
]
