// Currency Exchange JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const swapBtn = document.getElementById('swapBtn');
    const fromCurrency = document.getElementById('fromCurrency');
    const toCurrency = document.getElementById('toCurrency');
    const fromAmount = document.getElementById('fromAmount');
    const toAmount = document.getElementById('toAmount');
    const exchangeForm = document.getElementById('exchangeForm');

    // Swap currencies
    if (swapBtn) {
        swapBtn.addEventListener('click', function() {
            const tempCurrency = fromCurrency.value;
            fromCurrency.value = toCurrency.value;
            toCurrency.value = tempCurrency;

            const tempAmount = fromAmount.value;
            fromAmount.value = toAmount.value;
            toAmount.value = tempAmount;
        });
    }

    // Auto-convert on input change (optional - requires AJAX)
    fromAmount.addEventListener('input', debounce(function() {
        if (this.value && parseFloat(this.value) > 0) {
            autoConvert();
        }
    }, 500));

    fromCurrency.addEventListener('change', function() {
        if (fromAmount.value && parseFloat(fromAmount.value) > 0) {
            autoConvert();
        }
    });

    toCurrency.addEventListener('change', function() {
        if (fromAmount.value && parseFloat(fromAmount.value) > 0) {
            autoConvert();
        }
    });

    // AJAX auto-convert function
    function autoConvert() {
        const amount = fromAmount.value;
        const from = fromCurrency.value;
        const to = toCurrency.value;

        if (!amount || !from || !to) return;

        // Get CSRF token
        const csrftoken = document.querySelector('[name=csrfmiddlewaretoken]').value;

        // Make AJAX request to convert
        fetch(window.location.pathname, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'X-CSRFToken': csrftoken,
                'X-Requested-With': 'XMLHttpRequest'
            },
            body: `from_amount=${amount}&from_currency=${from}&to_currency=${to}`
        })
        .then(response => response.json())
        .then(data => {
            if (data.success) {
                toAmount.value = data.converted_amount;
                
                // Update exchange rate display if it exists
                const rateDisplay = document.querySelector('.exchange-rate-display p');
                if (rateDisplay && data.exchange_rate) {
                    rateDisplay.textContent = `1 ${from} = ${data.exchange_rate} ${to}`;
                }
            }
        })
        .catch(error => {
            console.error('Conversion error:', error);
        });
    }

    // Debounce function to limit API calls
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func.apply(this, args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
});