/* ===================================
   Payment Page JavaScript
   =================================== */

(function ($) {
    'use strict';

    // Document Ready
    $(document).ready(function () {
        // Initialize all functions
        initPaymentCalculator();
        initFormValidation();
        initRecipientSearch();
        initPaymentMethods();
        initTransactionPIN();
        initQuickAmounts();
        initSavedRecipients();
        initAutoSave();
    });

    // Payment Calculator
    function initPaymentCalculator() {
        const amountInput = $('#amount');
        const currencySelect = $('#currency');
        const summaryAmount = $('#summary-amount');
        const summaryFee = $('#summary-fee');
        const summaryTotal = $('#summary-total');

        // Fee structure based on currency
        const feeRates = {
            'USD': 0.015, // 1.5%
            'EUR': 0.018, // 1.8%
            'GBP': 0.020, // 2.0%
            'NGN': 0.010, // 1.0%
            'CAD': 0.015  // 1.5%
        };

        function calculateFees() {
            const amount = parseFloat(amountInput.val()) || 0;
            const currency = currencySelect.val();
            const rate = feeRates[currency] || 0.015;
            const fee = amount * rate;
            const total = amount + fee;

            // Get currency symbol
            const symbols = {
                'USD': '$',
                'EUR': '€',
                'GBP': '£',
                'NGN': '₦',
                'CAD': 'C$'
            };
            const symbol = symbols[currency] || '$';

            // Update summary with animation
            animateValue(summaryAmount, symbol + amount.toFixed(2));
            animateValue(summaryFee, symbol + fee.toFixed(2));
            animateValue(summaryTotal, symbol + total.toFixed(2));
        }

        // Animate number changes
        function animateValue(element, newValue) {
            element.fadeOut(200, function() {
                $(this).text(newValue).fadeIn(200);
            });
        }

        // Event listeners
        amountInput.on('input', calculateFees);
        currencySelect.on('change', calculateFees);

        // Format currency input
        amountInput.on('blur', function() {
            const value = parseFloat($(this).val());
            if (!isNaN(value)) {
                $(this).val(value.toFixed(2));
            }
        });
    }

    // Form Validation
    function initFormValidation() {
        const form = $('#paymentForm');

        // Email/Username validation
        $('#recipient_email').on('blur', function() {
            const value = $(this).val().trim();
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
            
            if (value && !emailRegex.test(value) && !usernameRegex.test(value)) {
                showError($(this), 'Please enter a valid email or username');
            } else {
                clearError($(this));
            }
        });

        // Amount validation
        $('#amount').on('blur', function() {
            const value = parseFloat($(this).val());
            if (value < 1) {
                showError($(this), 'Minimum amount is $1.00');
            } else if (value > 50000) {
                showError($(this), 'Maximum amount is $50,000.00');
            } else {
                clearError($(this));
            }
        });

        // Phone validation
        $('#recipient_phone').on('blur', function() {
            const value = $(this).val().trim();
            if (value) {
                const phoneRegex = /^\+?[\d\s\-()]+$/;
                if (!phoneRegex.test(value)) {
                    showError($(this), 'Please enter a valid phone number');
                } else {
                    clearError($(this));
                }
            }
        });

        // Transaction PIN validation
        $('#transaction_pin').on('input', function() {
            const value = $(this).val();
            // Only allow digits
            $(this).val(value.replace(/\D/g, ''));
        });

        // Form submission
        form.on('submit', function(e) {
            e.preventDefault();
            
            // Validate all fields
            let isValid = true;
            
            // Check required fields
            form.find('[required]').each(function() {
                if (!$(this).val().trim()) {
                    showError($(this), 'This field is required');
                    isValid = false;
                }
            });

            // Validate PIN
            const pin = $('#transaction_pin').val();
            if (pin.length !== 4) {
                showError($('#transaction_pin'), 'PIN must be 4 digits');
                isValid = false;
            }

            if (isValid) {
                showConfirmationModal();
            }
        });
    }

    // Show error message
    function showError(input, message) {
        const parent = input.closest('.single-input');
        parent.addClass('has-error');
        input.addClass('error');
        
        let errorMsg = parent.find('.error-message');
        if (errorMsg.length === 0) {
            errorMsg = $('<div class="error-message"></div>');
            parent.append(errorMsg);
        }
        errorMsg.text(message).show();
    }

    // Clear error message
    function clearError(input) {
        const parent = input.closest('.single-input');
        parent.removeClass('has-error');
        input.removeClass('error');
        parent.find('.error-message').hide();
    }

    // Recipient Search/Autocomplete
    function initRecipientSearch() {
        const recipientInput = $('#recipient_email');
        
        recipientInput.on('input', function() {
            const query = $(this).val().trim();
            
            if (query.length >= 3) {
                // Simulate API call for recipient suggestions
                // In production, replace with actual AJAX call
                setTimeout(function() {
                    showRecipientSuggestions(query);
                }, 300);
            }
        });
    }

    // Show recipient suggestions
    function showRecipientSuggestions(query) {
        // Mock data - replace with actual API response
        const suggestions = [
            { email: 'john.doe@example.com', name: 'John Doe', avatar: 'JD' },
            { email: 'jane.smith@example.com', name: 'Jane Smith', avatar: 'JS' },
            { email: 'mike.johnson@example.com', name: 'Mike Johnson', avatar: 'MJ' }
        ];

        // Create suggestions dropdown
        const dropdown = $('<div class="recipient-suggestions"></div>');
        
        suggestions.forEach(function(recipient) {
            const item = $(`
                <div class="suggestion-item" data-email="${recipient.email}" data-name="${recipient.name}">
                    <div class="avatar">${recipient.avatar}</div>
                    <div class="info">
                        <div class="name">${recipient.name}</div>
                        <div class="email">${recipient.email}</div>
                    </div>
                </div>
            `);
            dropdown.append(item);
        });

        // Remove existing dropdown
        $('.recipient-suggestions').remove();
        
        // Append new dropdown
        $('#recipient_email').parent().append(dropdown);

        // Handle suggestion click
        $('.suggestion-item').on('click', function() {
            const email = $(this).data('email');
            const name = $(this).data('name');
            
            $('#recipient_email').val(email);
            $('#recipient_name').val(name);
            dropdown.remove();
        });

        // Close dropdown on outside click
        $(document).on('click', function(e) {
            if (!$(e.target).closest('.single-input').length) {
                $('.recipient-suggestions').remove();
            }
        });
    }

    // Payment Method Selection
    function initPaymentMethods() {
        $('input[name="payment_method"]').on('change', function() {
            const method = $(this).val();
            
            // Remove all method-specific sections
            $('.card-details, .bank-details').remove();
            
            // Add method-specific fields
            if (method === 'card') {
                addCardFields();
            } else if (method === 'bank') {
                addBankFields();
            }
        });
    }

    // Add credit card fields
    function addCardFields() {
        const cardSection = $(`
            <div class="form-section card-details">
                <h5 class="section-title">Card Information</h5>
                <div class="row">
                    <div class="col-12">
                        <div class="single-input">
                            <label for="card_number">Card Number</label>
                            <input type="text" id="card_number" placeholder="1234 5678 9012 3456" maxlength="19">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="single-input">
                            <label for="card_expiry">Expiry Date</label>
                            <input type="text" id="card_expiry" placeholder="MM/YY" maxlength="5">
                        </div>
                    </div>
                    <div class="col-md-6">
                        <div class="single-input">
                            <label for="card_cvv">CVV</label>
                            <input type="text" id="card_cvv" placeholder="123" maxlength="4">
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        $('.form-section').last().after(cardSection);
        
        // Format card number
        $('#card_number').on('input', function() {
            let value = $(this).val().replace(/\s/g, '');
            let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
            $(this).val(formatted);
        });
        
        // Format expiry date
        $('#card_expiry').on('input', function() {
            let value = $(this).val().replace(/\//g, '');
            if (value.length >= 2) {
                value = value.slice(0, 2) + '/' + value.slice(2, 4);
            }
            $(this).val(value);
        });
    }

    // Add bank transfer fields
    function addBankFields() {
        const bankSection = $(`
            <div class="form-section bank-details">
                <h5 class="section-title">Bank Information</h5>
                <div class="row">
                    <div class="col-12">
                        <div class="single-input">
                            <label for="bank_name">Bank Name</label>
                            <select id="bank_name" class="nice-select">
                                <option value="">Select Bank</option>
                                <option value="chase">Chase Bank</option>
                                <option value="boa">Bank of America</option>
                                <option value="wells">Wells Fargo</option>
                                <option value="citi">Citibank</option>
                            </select>
                        </div>
                    </div>
                    <div class="col-12">
                        <div class="single-input">
                            <label for="account_number">Account Number</label>
                            <input type="text" id="account_number" placeholder="Enter account number">
                        </div>
                    </div>
                </div>
            </div>
        `);
        
        $('.form-section').last().after(bankSection);
        
        // Reinitialize nice-select
        if ($.fn.niceSelect) {
            $('#bank_name').niceSelect();
        }
    }

    // Transaction PIN handling
    function initTransactionPIN() {
        $('#transaction_pin').on('input', function() {
            const pin = $(this).val();
            
            // Visual feedback
            if (pin.length === 4) {
                $(this).addClass('valid');
            } else {
                $(this).removeClass('valid');
            }
        });

        // Add show/hide PIN toggle
        const pinInput = $('#transaction_pin');
        const toggleBtn = $('<button type="button" class="pin-toggle"><i class="fas fa-eye"></i></button>');
        
        pinInput.parent().css('position', 'relative').append(toggleBtn);
        
        toggleBtn.on('click', function() {
            const type = pinInput.attr('type') === 'password' ? 'text' : 'password';
            pinInput.attr('type', type);
            $(this).find('i').toggleClass('fa-eye fa-eye-slash');
        });
    }

    // Quick amount buttons
    function initQuickAmounts() {
        const amounts = [50, 100, 500, 1000, 5000];
        const quickAmounts = $('<div class="quick-amounts"></div>');
        
        amounts.forEach(function(amount) {
            const btn = $(`<button type="button" class="quick-amount-btn">$${amount}</button>`);
            quickAmounts.append(btn);
        });
        
        $('#amount').parent().append(quickAmounts);
        
        $('.quick-amount-btn').on('click', function() {
            const amount = $(this).text().replace('$', '');
            $('#amount').val(amount).trigger('input');
            $('.quick-amount-btn').removeClass('active');
            $(this).addClass('active');
        });
    }

    // Saved recipients functionality
    function initSavedRecipients() {
        // Load saved recipients from localStorage
        const savedRecipients = JSON.parse(localStorage.getItem('savedRecipients') || '[]');
        
        if (savedRecipients.length > 0) {
            const recipientsSection = $(`
                <div class="saved-recipients-section">
                    <h5>Frequently Used Recipients</h5>
                    <div class="recipients-list"></div>
                </div>
            `);
            
            savedRecipients.slice(0, 5).forEach(function(recipient) {
                const item = $(`
                    <div class="recipient-item" data-email="${recipient.email}" data-name="${recipient.name}">
                        <div class="avatar">${recipient.name.charAt(0)}</div>
                        <div class="name">${recipient.name}</div>
                    </div>
                `);
                recipientsSection.find('.recipients-list').append(item);
            });
            
            $('.form-section').first().before(recipientsSection);
            
            // Handle recipient click
            $('.recipient-item').on('click', function() {
                $('#recipient_email').val($(this).data('email'));
                $('#recipient_name').val($(this).data('name'));
                $('.recipient-item').removeClass('selected');
                $(this).addClass('selected');
            });
        }
    }

    // Auto-save form data
    function initAutoSave() {
        const form = $('#paymentForm');
        const formData = {};
        
        // Load saved data
        const saved = localStorage.getItem('draftPayment');
        if (saved) {
            const data = JSON.parse(saved);
            Object.keys(data).forEach(function(key) {
                $(`[name="${key}"]`).val(data[key]);
            });
        }
        
        // Save on input
        form.find('input, textarea, select').on('change', function() {
            const name = $(this).attr('name');
            const value = $(this).val();
            
            if (name && name !== 'transaction_pin') {
                formData[name] = value;
                localStorage.setItem('draftPayment', JSON.stringify(formData));
            }
        });
        
        // Clear on successful submission
        form.on('submit', function() {
            localStorage.removeItem('draftPayment');
        });
    }

    // Confirmation modal
    function showConfirmationModal() {
        const amount = $('#amount').val();
        const currency = $('#currency').val();
        const recipient = $('#recipient_name').val();
        
        const modal = $(`
            <div class="confirmation-modal">
                <div class="modal-content">
                    <div class="modal-header">
                        <h3>Confirm Payment</h3>
                        <button class="close-modal">&times;</button>
                    </div>
                    <div class="modal-body">
                        <div class="confirm-details">
                            <div class="detail-row">
                                <span>Recipient:</span>
                                <strong>${recipient}</strong>
                            </div>
                            <div class="detail-row">
                                <span>Amount:</span>
                                <strong>${currency} ${amount}</strong>
                            </div>
                        </div>
                        <p class="warning-text">
                            <i class="fas fa-exclamation-triangle"></i>
                            Please verify the details before confirming. This action cannot be undone.
                        </p>
                    </div>
                    <div class="modal-footer">
                        <button class="btn-cancel">Cancel</button>
                        <button class="btn-confirm">Confirm Payment</button>
                    </div>
                </div>
            </div>
        `);
        
        $('body').append(modal);
        modal.fadeIn(300);
        
        // Close modal
        modal.find('.close-modal, .btn-cancel').on('click', function() {
            modal.fadeOut(300, function() {
                $(this).remove();
            });
        });
        
        // Confirm payment
        modal.find('.btn-confirm').on('click', function() {
            $(this).addClass('loading').text('Processing...');
            
            // Submit form
            setTimeout(function() {
                $('#paymentForm')[0].submit();
            }, 1000);
        });
    }

    // Utility: Number animation
    function animateNumber(element, start, end, duration) {
        const range = end - start;
        const increment = range / (duration / 16);
        let current = start;
        
        const timer = setInterval(function() {
            current += increment;
            if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                current = end;
                clearInterval(timer);
            }
            element.text(current.toFixed(2));
        }, 16);
    }

})(jQuery);

// Additional styles for dynamically added elements
const dynamicStyles = `
<style>
.recipient-suggestions {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: white;
    border: 1px solid #e9ecef;
    border-radius: 8px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.1);
    max-height: 250px;
    overflow-y: auto;
    z-index: 100;
    margin-top: 5px;
}

.suggestion-item {
    display: flex;
    align-items: center;
    padding: 12px 15px;
    cursor: pointer;
    transition: all 0.3s;
}

.suggestion-item:hover {
    background: rgba(95, 39, 205, 0.05);
}

.suggestion-item .avatar {
    width: 40px;
    height: 40px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-right: 12px;
}

.suggestion-item .info {
    flex: 1;
}

.suggestion-item .name {
    font-weight: 600;
    color: #1e2746;
}

.suggestion-item .email {
    font-size: 12px;
    color: #6c757d;
}

.pin-toggle {
    position: absolute;
    right: 15px;
    top: 38px;
    background: none;
    border: none;
    color: #6c757d;
    cursor: pointer;
    padding: 5px;
}

.quick-amounts {
    display: flex;
    gap: 10px;
    margin-top: 10px;
    flex-wrap: wrap;
}

.quick-amount-btn {
    padding: 8px 16px;
    border: 1px solid #e9ecef;
    background: white;
    border-radius: 6px;
    cursor: pointer;
    transition: all 0.3s;
    font-size: 14px;
}

.quick-amount-btn:hover,
.quick-amount-btn.active {
    background: #5f27cd;
    color: white;
    border-color: #5f27cd;
}

.saved-recipients-section {
    margin-bottom: 30px;
    padding: 20px;
    background: #f8f9fa;
    border-radius: 10px;
}

.saved-recipients-section h5 {
    margin-bottom: 15px;
    font-size: 14px;
    font-weight: 600;
}

.recipients-list {
    display: flex;
    gap: 15px;
    overflow-x: auto;
}

.recipient-item {
    display: flex;
    flex-direction: column;
    align-items: center;
    padding: 15px;
    background: white;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s;
    min-width: 100px;
}

.recipient-item:hover,
.recipient-item.selected {
    background: #5f27cd;
    color: white;
    transform: translateY(-3px);
}

.recipient-item .avatar {
    width: 50px;
    height: 50px;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    margin-bottom: 8px;
}

.recipient-item.selected .avatar {
    background: white;
    color: #5f27cd;
}

.recipient-item .name {
    font-size: 12px;
    text-align: center;
}

.confirmation-modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0,0,0,0.5);
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 9999;
}

.confirmation-modal .modal-content {
    background: white;
    border-radius: 15px;
    max-width: 500px;
    width: 90%;
    box-shadow: 0 10px 40px rgba(0,0,0,0.3);
}

.confirmation-modal .modal-header {
    padding: 25px;
    border-bottom: 1px solid #e9ecef;
    display: flex;
    justify-content: space-between;
    align-items: center;
}

.confirmation-modal .close-modal {
    background: none;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #6c757d;
}

.confirmation-modal .modal-body {
    padding: 25px;
}

.confirm-details {
    margin-bottom: 20px;
}

.detail-row {
    display: flex;
    justify-content: space-between;
    padding: 12px 0;
    border-bottom: 1px solid #f0f0f0;
}

.warning-text {
    color: #856404;
    background: #fff3cd;
    padding: 12px;
    border-radius: 6px;
    font-size: 14px;
}

.confirmation-modal .modal-footer {
    padding: 20px 25px;
    border-top: 1px solid #e9ecef;
    display: flex;
    gap: 10px;
    justify-content: flex-end;
}

.btn-cancel,
.btn-confirm {
    padding: 10px 25px;
    border: none;
    border-radius: 6px;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.3s;
}

.btn-cancel {
    background: #e9ecef;
    color: #495057;
}

.btn-cancel:hover {
    background: #dee2e6;
}

.btn-confirm {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
}

.btn-confirm:hover {
    transform: translateY(-2px);
    box-shadow: 0 5px 15px rgba(95, 39, 205, 0.3);
}
</style>
`;

// Inject dynamic styles
document.head.insertAdjacentHTML('beforeend', dynamicStyles);