// Invoice Management JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Set default dates
    const today = new Date();
    const issueDate = document.getElementById('issueDate');
    const dueDate = document.getElementById('dueDate');
    
    if (issueDate && dueDate) {
        issueDate.value = today.toISOString().split('T')[0];
        
        const due = new Date();
        due.setDate(due.getDate() + 30);
        dueDate.value = due.toISOString().split('T')[0];
    }

    // Calculate total with tax
    const amountInput = document.getElementById('invoiceAmount');
    const taxInput = document.getElementById('taxRate');
    const totalDisplay = document.getElementById('totalAmount');
    const currencySelect = document.querySelector('select[name="currency"]');

    function calculateTotal() {
        const amount = parseFloat(amountInput.value) || 0;
        const taxRate = parseFloat(taxInput.value) || 0;
        const taxAmount = (amount * taxRate) / 100;
        const total = amount + taxAmount;
        
        const currencySymbol = currencySelect.value;
        totalDisplay.textContent = `${currencySymbol}${total.toFixed(2)}`;
    }

    if (amountInput && taxInput) {
        amountInput.addEventListener('input', calculateTotal);
        taxInput.addEventListener('input', calculateTotal);
        currencySelect.addEventListener('change', calculateTotal);
    }

    // Form submission
    const invoiceForm = document.getElementById('invoiceForm');
    if (invoiceForm) {
        invoiceForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            
            // Validation
            const amount = parseFloat(formData.get('amount'));
            if (amount <= 0) {
                alert('Amount must be greater than 0');
                return;
            }

            const issueDateVal = new Date(formData.get('issue_date'));
            const dueDateVal = new Date(formData.get('due_date'));
            
            if (dueDateVal <= issueDateVal) {
                alert('Due date must be after invoice date');
                return;
            }

            // Generate invoice number
            const invoiceNumber = generateInvoiceNumber();
            
            // Create invoice object
            const invoiceData = {
                invoice_number: invoiceNumber,
                client_name: formData.get('client_name'),
                client_email: formData.get('client_email'),
                client_phone: formData.get('client_phone'),
                client_company: formData.get('client_company'),
                issue_date: formData.get('issue_date'),
                due_date: formData.get('due_date'),
                description: formData.get('description'),
                amount: amount,
                tax: parseFloat(formData.get('tax')) || 0,
                currency: formData.get('currency'),
                total: parseFloat(totalDisplay.textContent.replace(/[^0-9.]/g, ''))
            };

            // Generate and download PDF
            generateInvoicePDF(invoiceData);
            
            // Show success message
            alert(`Invoice ${invoiceNumber} created successfully!`);
            
            // Reset form
            this.reset();
            calculateTotal();
            
            // Reset dates
            issueDate.value = today.toISOString().split('T')[0];
            const due = new Date();
            due.setDate(due.getDate() + 30);
            dueDate.value = due.toISOString().split('T')[0];
        });
    }

    // Preview button
    const previewBtn = document.getElementById('previewBtn');
    if (previewBtn) {
        previewBtn.addEventListener('click', function() {
            const formData = new FormData(invoiceForm);
            
            const amount = parseFloat(formData.get('amount')) || 0;
            if (amount <= 0) {
                alert('Please enter an amount to preview');
                return;
            }

            const invoiceData = {
                invoice_number: generateInvoiceNumber(),
                client_name: formData.get('client_name') || 'N/A',
                client_email: formData.get('client_email') || 'N/A',
                client_phone: formData.get('client_phone') || 'N/A',
                client_company: formData.get('client_company') || 'N/A',
                issue_date: formData.get('issue_date'),
                due_date: formData.get('due_date'),
                description: formData.get('description') || 'N/A',
                amount: amount,
                tax: parseFloat(formData.get('tax')) || 0,
                currency: formData.get('currency'),
                total: parseFloat(totalDisplay.textContent.replace(/[^0-9.]/g, ''))
            };

            showInvoicePreview(invoiceData);
        });
    }

    // Download from preview
    const downloadPreviewBtn = document.getElementById('downloadPreviewBtn');
    if (downloadPreviewBtn) {
        downloadPreviewBtn.addEventListener('click', function() {
            // Get the preview data and generate PDF
            alert('Downloading invoice...');
            // In production, trigger actual PDF download
        });
    }

    // Download buttons in invoice list
    const downloadButtons = document.querySelectorAll('.btn-icon');
    downloadButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const invoiceItem = this.closest('.invoice-item');
            const invoiceNumber = invoiceItem.querySelector('.invoice-number').textContent;
            alert(`Downloading invoice ${invoiceNumber}...`);
            // In production, trigger actual download
        });
    });
});

// Generate invoice number
function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const random = Math.floor(Math.random() * 9000) + 1000;
    
    return `INV-${year}${month}${day}-${random}`;
}

// Show invoice preview in modal
function showInvoicePreview(data) {
    const previewContainer = document.getElementById('invoicePreview');
    
    const taxAmount = (data.amount * data.tax) / 100;
    
    const html = `
        <div style="max-width: 800px; margin: 0 auto; font-family: Arial, sans-serif;">
            <div style="text-align: center; margin-bottom: 40px;">
                <h1 style="color: #667eea; margin-bottom: 10px;">INVOICE</h1>
                <p style="color: #666; font-size: 18px;">#${data.invoice_number}</p>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 40px; margin-bottom: 40px;">
                <div>
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">From:</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>Virtual Bank</strong></p>
                    <p style="margin: 5px 0; color: #666;">123 Banking Street</p>
                    <p style="margin: 5px 0; color: #666;">Lagos, Nigeria</p>
                    <p style="margin: 5px 0; color: #666;">contact@virtualbank.com</p>
                </div>
                
                <div>
                    <h3 style="color: #2c3e50; margin-bottom: 15px;">Bill To:</h3>
                    <p style="margin: 5px 0; color: #666;"><strong>${data.client_name}</strong></p>
                    ${data.client_company !== 'N/A' ? `<p style="margin: 5px 0; color: #666;">${data.client_company}</p>` : ''}
                    <p style="margin: 5px 0; color: #666;">${data.client_email}</p>
                    ${data.client_phone !== 'N/A' ? `<p style="margin: 5px 0; color: #666;">${data.client_phone}</p>` : ''}
                </div>
            </div>
            
            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 40px; background: #f8f9fa; padding: 20px; border-radius: 8px;">
                <div>
                    <p style="margin: 5px 0; color: #666;"><strong>Invoice Date:</strong></p>
                    <p style="margin: 5px 0; color: #2c3e50;">${formatDate(data.issue_date)}</p>
                </div>
                <div>
                    <p style="margin: 5px 0; color: #666;"><strong>Due Date:</strong></p>
                    <p style="margin: 5px 0; color: #2c3e50;">${formatDate(data.due_date)}</p>
                </div>
            </div>
            
            <table style="width: 100%; border-collapse: collapse; margin-bottom: 30px;">
                <thead>
                    <tr style="background: #667eea; color: white;">
                        <th style="padding: 15px; text-align: left;">Description</th>
                        <th style="padding: 15px; text-align: right;">Amount</th>
                    </tr>
                </thead>
                <tbody>
                    <tr style="border-bottom: 1px solid #e0e0e0;">
                        <td style="padding: 20px;">${data.description}</td>
                        <td style="padding: 20px; text-align: right; font-weight: 600;">${data.currency}${data.amount.toFixed(2)}</td>
                    </tr>
                </tbody>
            </table>
            
            <div style="margin-left: auto; max-width: 300px;">
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <span style="color: #666;">Subtotal:</span>
                    <span style="font-weight: 600;">${data.currency}${data.amount.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 10px 0; border-bottom: 1px solid #e0e0e0;">
                    <span style="color: #666;">Tax (${data.tax}%):</span>
                    <span style="font-weight: 600;">${data.currency}${taxAmount.toFixed(2)}</span>
                </div>
                <div style="display: flex; justify-content: space-between; padding: 15px 0; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin-top: 10px; padding: 20px; border-radius: 8px; color: white;">
                    <span style="font-size: 18px; font-weight: 600;">Total:</span>
                    <span style="font-size: 24px; font-weight: 700;">${data.currency}${data.total.toFixed(2)}</span>
                </div>
            </div>
            
            <div style="margin-top: 60px; padding-top: 30px; border-top: 2px solid #e0e0e0; text-align: center; color: #999;">
                <p style="margin: 5px 0;">Thank you for your business!</p>
                <p style="margin: 5px 0; font-size: 14px;">Payment is due within 30 days. Please include invoice number on your payment.</p>
            </div>
        </div>
    `;
    
    previewContainer.innerHTML = html;
    
    // Show modal using Bootstrap
    const modal = new bootstrap.Modal(document.getElementById('previewModal'));
    modal.show();
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

// Generate PDF (simplified version - in production use a proper PDF library)
function generateInvoicePDF(data) {
    showInvoicePreview(data);
    
    console.log('Invoice data ready for PDF generation:', data);
    

}