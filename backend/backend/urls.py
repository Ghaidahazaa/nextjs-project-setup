from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/users/', include('users.urls')),
    path('api/medications/', include('medications.urls')),
    path('api/reminders/', include('reminders.urls')),
    path('api/sideeffects/', include('sideeffects.urls')),
    path('api/insights/', include('insights.urls')),
]
