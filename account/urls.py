from django.urls import path
from .views import kyc_registration, account,Dashboard
from . import views


app_name = 'account'

urlpatterns = [
    path("",account , name='account'),
    path("dashboard",Dashboard , name='dashboard'),

    path("kyc-reg/",kyc_registration, name='kyc-reg'),
    path("crypto/",views.crypto, name='crypto'),
    path('deposit-money/', views.deposit_money, name = "deposit-money"),
    path('saved-recipients/', views.saved_recipients, name = "saved-recipients"),
]
