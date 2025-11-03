from django.urls import path
from .views import index
from .transfare import search_using_account, AmountTranfare, AmountTranfareProcess,TransactionConfirmation,TransfarProcess, TransfarCompleted
from .transaction import transaction_list, transaction_detail
from .payment_request import SearchUserRequest, AmountRequest, AmountRequestProcess, RequestConfirmation, RequestCompleted, RequestFinialProcess, settlement_confirmation, settlement_processing, SettlementCompleted, delete_payment_request
from .credit_card import credit_card_detail, fund_credit_card, withdraw_credit_card, delete_card
from . import views
from .views import about

app_name = "core"

urlpatterns = [
    path("", index, name='index'),
    path('search-account/', search_using_account, name='search-account'),
    path('amount-transfare/<account_number>/',AmountTranfare , name='amount-transfare'),
    path('amount-transfare-process/<account_number>/',AmountTranfareProcess , name='amount-transfare-Process'),
    path('transfare-confirm/<account_number>/<transaction_id>/',TransactionConfirmation , name='transfare-confirmation'),
    path('transfare-process/<account_number>/<transaction_id>/',TransfarProcess , name='transaction-process'),
    path('transfare-completed/<account_number>/<transaction_id>/',TransfarCompleted , name='transfar-completed'),

    # Transaction
    path('transaction/',transaction_list, name='transaction-list' ),
    path('transaction/<transaction_id>',transaction_detail, name='transaction-detail' ),
    path('withdraw_money/',views.withdraw_money, name='withdraw_money' ),

    # Payment Request
    path('request-search-user/',SearchUserRequest, name='request-search-user' ),
    path('amount-request/<account_number>',AmountRequest, name='amount-request' ),
    path('amount-request-process/<account_number>/',AmountRequestProcess , name='amount-request-Process'),
    path('request-confirm/<account_number>/<transaction_id>/',RequestConfirmation , name='request-confirmation'),
    path('request-process/<account_number>/<transaction_id>/',RequestFinialProcess , name='request-finial-process'),
    path('request-completed/<account_number>/<transaction_id>/',RequestCompleted , name='request-completed'),
    path('settlement-confirmation/<account_number>/<transaction_id>/', settlement_confirmation, name='settlement-confirmation'),
    path('settlement-processing/<account_number>/<transaction_id>/',settlement_processing, name= 'settlement_processing'),
    path('settlement-completed/<account_number>/<transaction_id>/',SettlementCompleted , name='settlement-completed'),
    path('delete-request/<account_number>/<transaction_id>/',delete_payment_request , name='delete-request'),

    # Credit Card
    path('card/<card_id>/', credit_card_detail, name="card_detail" ),
    path('fund-credit-card/<card_id>/',fund_credit_card, name= "fund-credit-card" ),
    path('withdraw-credit-card/<card_id>/',withdraw_credit_card, name= "withdraw-credit-card" ),
    path('delete-credit-card/<card_id>/',delete_card, name= "delete-card" ),
    
    # Personal Pages
    path('payments/', views.payments, name='payments'),
    path('subscriptions/', views.subscriptions, name='subscriptions'),
    path('security/', views.security, name='security'),
    path('fees/', views.fees, name='fees'),

    # Business Pages
    path('business-payments/', views.business_payments, name='business-payments'),
    path('business-account/', views.business_account, name='business-account'),
    path('corporate-card/', views.corporate_card, name='corporate-card'),
    path('expense-management/', views.expense_management, name='expense-management'),
    path('budgeting-analytics/', views.budgeting_analytics, name='budgeting-analytics'),
    path('integrations/', views.integrations, name='integrations'),
    path('invoice-management/', views.invoice_management, name='invoice-management'),
    path('business-security/', views.business_security, name='business-security'),
    path('rewards/', views.rewards, name='rewards'),
    path('business-fees/', views.business_fees, name='business-fees'),

    # Company Pages
    path('about/', about, name='about'),
    path('career/', views.career, name='career'),
    path('career-details/', views.career_details, name='career-details'),
    path('blog/', views.blog, name='blog'),
    path('blog-details/', views.blog_details, name='blog-details'),
    path('error/', views.error_page, name='error'),

    # Help Pages
    path('help-center/', views.help_center, name='help-center'),
    path('help-center-category/', views.help_center_category, name='help-center-category'),
]