from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from django.contrib import messages
from django.db.models import Q
from account.models import Account
from core.models import Transaction, CreditCard
from decimal import Decimal


# invoice management 

from datetime import datetime, timedelta


@login_required
def invoice_management(request):
    """
    Invoice management view with CRUD operations
    """
    
    if request.method == 'POST':
        try:
            # Create new invoice
            invoice_data = {
                'client_name': request.POST.get('client_name'),
                'client_email': request.POST.get('client_email'),
                'issue_date': request.POST.get('issue_date'),
                'due_date': request.POST.get('due_date'),
                'description': request.POST.get('description'),
                'amount': Decimal(request.POST.get('amount')),
                'currency': request.POST.get('currency'),
            }
            
            # Validate dates
            issue_date = datetime.strptime(invoice_data['issue_date'], '%Y-%m-%d').date()
            due_date = datetime.strptime(invoice_data['due_date'], '%Y-%m-%d').date()
            
            if due_date <= issue_date:
                messages.error(request, 'Due date must be after issue date')
                return redirect('core:invoice-management')
            
            # Generate invoice number
            invoice_number = generate_invoice_number()
            
            # In production, save to database
            # Invoice.objects.create(
            #     user=request.user,
            #     invoice_number=invoice_number,
            #     **invoice_data
            # )
            
            messages.success(request, f'Invoice {invoice_number} created successfully!')
            return redirect('core:invoice-management')
            
        except Exception as e:
            messages.error(request, f'Error creating invoice: {str(e)}')
            return redirect('core:invoice-management')
    
    # Get invoices for current user
    # In production, fetch from database
    # invoices = Invoice.objects.filter(user=request.user).order_by('-created_at')
    
    # Sample data for demonstration
    invoices = get_sample_invoices()
    
    # Calculate statistics
    total_invoices = len(invoices)
    paid_invoices = len([inv for inv in invoices if inv['status'] == 'Paid'])
    pending_invoices = len([inv for inv in invoices if inv['status'] == 'Pending'])
    overdue_invoices = len([inv for inv in invoices if inv['status'] == 'Overdue'])
    
    context = {
        'invoices': invoices,
        'total_invoices': total_invoices,
        'paid_invoices': paid_invoices,
        'pending_invoices': pending_invoices,
        'overdue_invoices': overdue_invoices,
    }
    
    return render(request, 'invoice/invoice_management.html', context)


def generate_invoice_number():
    """
    Generate unique invoice number
    Format: INV-YYYYMMDD-XXXX
    """
    from datetime import datetime
    import random
    
    date_str = datetime.now().strftime('%Y%m%d')
    random_num = random.randint(1000, 9999)
    
    return f'INV-{date_str}-{random_num}'


def get_sample_invoices():
    """
    Sample invoice data for demonstration
    Replace with actual database queries in production
    """
    from datetime import datetime, timedelta
    
    today = datetime.now().date()
    
    return [
        {
            'invoice_number': 'INV-20250109-1234',
            'client_name': 'Acme Corporation',
            'issue_date': today - timedelta(days=5),
            'due_date': today + timedelta(days=25),
            'total_amount': '5,250.00',
            'currency': '$',
            'status': 'Pending'
        },
        {
            'invoice_number': 'INV-20250108-5678',
            'client_name': 'Tech Solutions Ltd',
            'issue_date': today - timedelta(days=10),
            'due_date': today - timedelta(days=2),
            'total_amount': '3,800.00',
            'currency': '$',
            'status': 'Overdue'
        },
        {
            'invoice_number': 'INV-20250107-9012',
            'client_name': 'Global Industries',
            'issue_date': today - timedelta(days=15),
            'due_date': today - timedelta(days=5),
            'total_amount': '8,500.00',
            'currency': '$',
            'status': 'Paid'
        },
        {
            'invoice_number': 'INV-20250106-3456',
            'client_name': 'Startup Inc',
            'issue_date': today - timedelta(days=20),
            'due_date': today + timedelta(days=10),
            'total_amount': '2,150.00',
            'currency': '$',
            'status': 'Paid'
        },
        {
            'invoice_number': 'INV-20250105-7890',
            'client_name': 'Enterprise Co',
            'issue_date': today - timedelta(days=3),
            'due_date': today + timedelta(days=27),
            'total_amount': '12,750.00',
            'currency': '$',
            'status': 'Pending'
        },
    ]


# Additional view for invoice details
@login_required
def invoice_detail(request, invoice_id):
    """
    View individual invoice details
    """
    # In production, fetch from database
    # invoice = get_object_or_404(Invoice, id=invoice_id, user=request.user)
    
    context = {
        'invoice': {}, 
    }
    
    return render(request, 'invoice/invoice_detail.html', context)


# View for downloading invoice as PDF
@login_required
def download_invoice_pdf(request, invoice_id):
    """
    Generate and download invoice as PDF
    """
    from django.http import HttpResponse
    
    messages.info(request, 'PDF download functionality will be implemented')
    return redirect('core:invoice-management')


# View for sending invoice via email
@login_required
def send_invoice_email(request, invoice_id):
    """
    Send invoice to client via email
    """
    from django.core.mail import send_mail
    from django.conf import settings
    
    # In production, fetch invoice and send email
    # invoice = get_object_or_404(Invoice, id=invoice_id, user=request.user)
    # 
    # subject = f'Invoice {invoice.invoice_number}'
    # message = f'Dear {invoice.client_name},\n\nPlease find attached your invoice.'
    # 
    # send_mail(
    #     subject,
    #     message,
    #     settings.DEFAULT_FROM_EMAIL,
    #     [invoice.client_email],
    #     fail_silently=False,
    # )
    
    messages.success(request, 'Invoice sent successfully!')
    return redirect('core:invoice-management')


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
    return render(request, 'core/invoice-management.html')

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
    return render(request, 'core/withdraw_money.html')

def request_search_user(request):
    return render(request, 'payment_request/search-user.html')

def process_payment(request):
    return render(request, "core/process-payment.html")

def saved_recipients(request):
    return render(request, "account/saved-recipients.html")

def crypto(request):
    return render(request, "account/crypto.html")


def deposit_money(request):
    return render(request, "acount/deposit-money.html")

def transaction_history(request):
    return render(request, "core/transaction-history.html")

def saved_recipients(request):
    return render(request, "account/saved-recipients.html")

def schedule_payment(request):
    return render(request, "core/schedule-payment.html")

def transaction_details(request):
    return render(request, "core/transaction-details.html")

def add_funds(request):
    return render(request, "core/add-funds.html")

def money_exchange(request):
    return render(request, 'core/money-exchange.html')


