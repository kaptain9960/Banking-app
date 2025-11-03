from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from account.models import Account
from core.models import Transaction, CreditCard
from decimal import Decimal

# Home and general pages
def index(request):
    return render(request, 'core/index.html')

def about(request):
    return render(request, 'company/about.html')

def payments(request):
    return render(request, 'payment_request/payments.html')

def subscriptions(request):
    return render(request, 'payment_request/subscriptions.html')

def security(request):
    return render(request, 'payment_request/security.html')

def fees(request):
    return render(request, 'payment_request/fees.html')

# Business Pages
def business_payments(request):
    return render(request, 'business/business-payments.html')

def business_account(request):
    return render(request, 'business/business-account.html')

def corporate_card(request):
    return render(request, 'business/corporate-card.html')

def expense_management(request):
    return render(request, 'business/expense-management.html')

def budgeting_analytics(request):
    return render(request, 'business/budgeting-analytics.html')

def integrations(request):
    return render(request, 'business/integrations.html')

def invoice_management(request):
    return render(request, 'business/invoice-management.html')

def business_security(request):
    return render(request, 'business/security.html')

def rewards(request):
    return render(request, 'business/rewards.html')

def business_fees(request):
    return render(request, 'business/fees.html')

# Company Pages
def career(request):
    return render(request, 'company/career.html')

def career_details(request):
    return render(request, 'company/career-details.html')

def blog(request):
    return render(request, 'company/blog.html')

def blog_details(request):
    return render(request, 'company/blog-details.html')

def error_page(request):
    return render(request, 'company/error.html')

# Help Pages
def help_center(request):
    return render(request, 'help/help-center.html')

def help_center_category(request):
    return render(request, 'help/help-center-category.html')

def withdraw_money(request):
    return render(request, 'transaction/withdraw-money-step-1.html')
