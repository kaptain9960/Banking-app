/* ============================================================
   PAYMENT PROCESSING SCRIPT
   Table of Contents:
   1. Configuration & Constants
   2. DOM Elements
   3. Processing Simulation
   4. Step Management
   5. Progress Updates
   6. Result Display
   7. Utility Functions
   8. Event Listeners
   9. Initialization
   ============================================================ */

(function() {
    'use strict';

    /* ============================================================
       1. CONFIGURATION & CONSTANTS
       ============================================================ */
    const CONFIG = {
        STEP_DURATION: 2000, // 2 seconds per step
        RESULT_DELAY: 1000, // 1 second delay before showing result
        SUCCESS_PROBABILITY: 0.85, // 85% success rate (for simulation)
        ANIMATION_SPEED: 500, // General animation speed
    };

    const STEP_STATES = {
        PENDING: 'pending',
        PROCESSING: 'processing',
        COMPLETED: 'completed',
        FAILED: 'failed'
    };

    const ICONS = {
        PENDING: '<i class="fas fa-clock"></i>',
        PROCESSING: '<i class="fas fa-spinner fa-spin"></i>',
        COMPLETED: '<i class="fas fa-check"></i>',
        FAILED: '<i class="fas fa-times"></i>'
    };

    const MESSAGES = {
        PENDING: 'Pending',
        PROCESSING: 'Processing',
        COMPLETED: 'Completed',
        FAILED: 'Failed'
    };

    /* ============================================================
       2. DOM ELEMENTS
       ============================================================ */
    const DOM = {
        steps: null,
        progressFill: null,
        progressPercent: null,
        processingContainer: null,
        resultContainer: null,
        successCard: null,
        errorCard: null,
        errorMessage: null,
        errorReason: null
    };

    /* ============================================================
       3. PROCESSING SIMULATION
       ============================================================ */
    class PaymentProcessor {
        constructor() {
            this.currentStep = 0;
            this.totalSteps = 0;
            this.isProcessing = false;
            this.shouldSucceed = true;
        }

        /**
         * Initialize the payment processor
         */
        init() {
            this.cacheDOMElements();
            this.totalSteps = DOM.steps.length;
            this.determineOutcome();
            this.startProcessing();
        }

        /**
         * Cache all DOM elements
         */
        cacheDOMElements() {
            DOM.steps = document.querySelectorAll('.step-item');
            DOM.progressFill = document.getElementById('progressFill');
            DOM.progressPercent = document.getElementById('progressPercent');
            DOM.processingContainer = document.querySelector('.processing-container');
            DOM.resultContainer = document.getElementById('resultContainer');
            DOM.successCard = document.getElementById('successCard');
            DOM.errorCard = document.getElementById('errorCard');
            DOM.errorMessage = document.getElementById('errorMessage');
            DOM.errorReason = document.getElementById('errorReason');

            // Validate all required elements exist
            if (!DOM.steps.length || !DOM.progressFill || !DOM.progressPercent) {
                console.error('Required DOM elements not found');
                return false;
            }
            return true;
        }

        /**
         * Determine if payment should succeed or fail (for simulation)
         */
        determineOutcome() {
            // In production, this would be determined by actual payment processing
            // For simulation, we use a random probability
            this.shouldSucceed = Math.random() < CONFIG.SUCCESS_PROBABILITY;
            
            // For testing, you can force a specific outcome:
            // this.shouldSucceed = true;  // Force success
            // this.shouldSucceed = false; // Force failure
        }

        /**
         * Start the payment processing
         */
        startProcessing() {
            if (this.isProcessing) return;
            
            this.isProcessing = true;
            this.processNextStep();
        }

        /**
         * Process the next step in the sequence
         */
        processNextStep() {
            if (this.currentStep < this.totalSteps) {
                this.updateStepState(this.currentStep, STEP_STATES.PROCESSING);
                this.updateProgress();

                setTimeout(() => {
                    // Check if this step should fail
                    const shouldFail = !this.shouldSucceed && this.currentStep === 2;
                    
                    if (shouldFail) {
                        this.handleStepFailure();
                    } else {
                        this.handleStepSuccess();
                    }
                }, CONFIG.STEP_DURATION);
            } else {
                this.completeProcessing();
            }
        }

        /**
         * Handle successful step completion
         */
        handleStepSuccess() {
            this.updateStepState(this.currentStep, STEP_STATES.COMPLETED);
            this.currentStep++;
            this.processNextStep();
        }

        /**
         * Handle step failure
         */
        handleStepFailure() {
            this.updateStepState(this.currentStep, STEP_STATES.FAILED);
            
            // Mark remaining steps as failed
            for (let i = this.currentStep + 1; i < this.totalSteps; i++) {
                this.updateStepState(i, STEP_STATES.FAILED);
            }
            
            this.completeProcessing();
        }

        /**
         * Complete the processing and show result
         */
        completeProcessing() {
            this.isProcessing = false;
            
            setTimeout(() => {
                this.showResult();
            }, CONFIG.RESULT_DELAY);
        }

        /**
         * Update the state of a specific step
         * @param {number} stepIndex - Index of the step to update
         * @param {string} state - New state for the step
         */
        updateStepState(stepIndex, state) {
            const step = DOM.steps[stepIndex];
            if (!step) return;

            const statusBadge = step.querySelector('.status-badge');
            if (!statusBadge) return;

            // Remove all state classes
            step.classList.remove(
                STEP_STATES.PROCESSING,
                STEP_STATES.COMPLETED,
                STEP_STATES.FAILED
            );

            // Add new state class
            if (state !== STEP_STATES.PENDING) {
                step.classList.add(state);
            }

            // Update badge
            statusBadge.className = `status-badge ${state}`;
            statusBadge.innerHTML = `${ICONS[state.toUpperCase()]} ${MESSAGES[state.toUpperCase()]}`;
        }

        /**
         * Update the progress bar
         */
        updateProgress() {
            const progress = ((this.currentStep + 1) / this.totalSteps) * 100;
            
            if (DOM.progressFill && DOM.progressPercent) {
                DOM.progressFill.style.width = `${progress}%`;
                
                // Animate the percentage
                this.animateNumber(
                    DOM.progressPercent,
                    parseInt(DOM.progressPercent.textContent) || 0,
                    Math.round(progress),
                    CONFIG.ANIMATION_SPEED
                );
            }
        }

        /**
         * Show the final result (success or error)
         */
        showResult() {
            if (!DOM.processingContainer || !DOM.resultContainer) return;

            // Hide processing container
            this.fadeOut(DOM.processingContainer, () => {
                DOM.processingContainer.style.display = 'none';
            });

            // Show result container
            DOM.resultContainer.style.display = 'block';

            if (this.shouldSucceed) {
                this.showSuccessResult();
            } else {
                this.showErrorResult();
            }
        }

        /**
         * Display success result
         */
        showSuccessResult() {
            if (DOM.successCard && DOM.errorCard) {
                DOM.successCard.style.display = 'block';
                DOM.errorCard.style.display = 'none';
                
                // Add confetti or celebration animation (optional)
                this.celebrateSuccess();
            }
        }

        /**
         * Display error result
         */
        showErrorResult() {
            if (DOM.successCard && DOM.errorCard) {
                DOM.successCard.style.display = 'none';
                DOM.errorCard.style.display = 'block';
                
                // Set error message
                this.setErrorMessage();
            }
        }

        /**
         * Set appropriate error message based on failure point
         */
        setErrorMessage() {
            const errorMessages = {
                0: {
                    title: 'Invalid Payment Details',
                    reason: 'The payment information provided is incorrect or incomplete'
                },
                1: {
                    title: 'Security Check Failed',
                    reason: 'Your transaction was flagged by our security system'
                },
                2: {
                    title: 'Payment Processing Failed',
                    reason: 'Insufficient funds in your account'
                },
                3: {
                    title: 'Transaction Confirmation Failed',
                    reason: 'Unable to confirm the transaction. Please try again'
                }
            };

            const error = errorMessages[this.currentStep] || errorMessages[2];

            if (DOM.errorMessage) {
                DOM.errorMessage.textContent = error.title;
            }

            if (DOM.errorReason) {
                DOM.errorReason.querySelector('span').textContent = error.reason;
            }
        }

        /**
         * Add celebration effect for successful payment
         */
        celebrateSuccess() {
            // Simple pulse animation on success icon
            const successIcon = DOM.successCard.querySelector('.result-icon');
            if (successIcon) {
                successIcon.style.animation = 'none';
                setTimeout(() => {
                    successIcon.style.animation = 'scaleIn 0.5s ease, pulse 2s ease-in-out 0.5s';
                }, 10);
            }
        }

        /**
         * Animate a number from start to end
         * @param {HTMLElement} element - Element to update
         * @param {number} start - Starting value
         * @param {number} end - Ending value
         * @param {number} duration - Animation duration in ms
         */
        animateNumber(element, start, end, duration) {
            const range = end - start;
            const increment = range / (duration / 16); // 60fps
            let current = start;

            const timer = setInterval(() => {
                current += increment;
                
                if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
                    current = end;
                    clearInterval(timer);
                }
                
                element.textContent = Math.round(current);
            }, 16);
        }

        /**
         * Fade out an element
         * @param {HTMLElement} element - Element to fade out
         * @param {Function} callback - Callback after fade out
         */
        fadeOut(element, callback) {
            element.style.transition = 'opacity 0.5s ease';
            element.style.opacity = '0';
            
            setTimeout(() => {
                if (callback) callback();
            }, 500);
        }
    }

    /* ============================================================
       4. UTILITY FUNCTIONS
       ============================================================ */

    /**
     * Get URL parameters
     * @param {string} param - Parameter name
     * @returns {string|null} Parameter value
     */
    function getURLParameter(param) {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(param);
    }

    /**
     * Format currency
     * @param {number} amount - Amount to format
     * @param {string} currency - Currency code
     * @returns {string} Formatted currency string
     */
    function formatCurrency(amount, currency = 'USD') {
        const symbols = {
            'USD': '$',
            'EUR': '€',
            'GBP': '£',
            'NGN': '₦',
            'CAD': 'C$'
        };
        
        return `${symbols[currency] || '$'}${parseFloat(amount).toFixed(2)}`;
    }

    /**
     * Log activity for debugging
     * @param {string} message - Log message
     * @param {*} data - Additional data
     */
    function logActivity(message, data = null) {
        if (window.console && typeof console.log === 'function') {
            const timestamp = new Date().toISOString();
            console.log(`[${timestamp}] ${message}`, data || '');
        }
    }

    /**
     * Handle errors gracefully
     * @param {Error} error - Error object
     */
    function handleError(error) {
        logActivity('Error occurred:', error);
        
        // In production, you might want to send this to an error tracking service
        // For now, we'll just log it
        
        // Show a generic error message to the user
        if (DOM.resultContainer && DOM.errorCard) {
            DOM.processingContainer.style.display = 'none';
            DOM.resultContainer.style.display = 'block';
            DOM.successCard.style.display = 'none';
            DOM.errorCard.style.display = 'block';
            
            if (DOM.errorMessage) {
                DOM.errorMessage.textContent = 'An unexpected error occurred';
            }
            
            if (DOM.errorReason) {
                DOM.errorReason.querySelector('span').textContent = 
                    'Please try again or contact support if the problem persists';
            }
        }
    }

    /* ============================================================
       5. EVENT LISTENERS
       ============================================================ */

    /**
     * Setup event listeners
     */
    function setupEventListeners() {
        // Print receipt button
        const printButtons = document.querySelectorAll('[data-action="print"]');
        printButtons.forEach(button => {
            button.addEventListener('click', handlePrint);
        });

        // Download receipt button
        const downloadButtons = document.querySelectorAll('[data-action="download"]');
        downloadButtons.forEach(button => {
            button.addEventListener('click', handleDownload);
        });

        // Share result button
        const shareButtons = document.querySelectorAll('[data-action="share"]');
        shareButtons.forEach(button => {
            button.addEventListener('click', handleShare);
        });
    }

    /**
     * Handle print action
     */
    function handlePrint() {
        window.print();
    }

    /**
     * Handle download action
     */
    function handleDownload() {
        logActivity('Download receipt clicked');
        // In production, trigger actual receipt download
        alert('Receipt download feature would be implemented here');
    }

    /**
     * Handle share action
     */
    function handleShare() {
        if (navigator.share) {
            navigator.share({
                title: 'Payment Confirmation',
                text: 'Payment completed successfully',
                url: window.location.href
            }).catch(err => logActivity('Error sharing:', err));
        } else {
            logActivity('Web Share API not supported');
        }
    }

    /* ============================================================
       6. INITIALIZATION
       ============================================================ */

    /**
     * Initialize the payment processing page
     */
    function init() {
        logActivity('Payment processing page loaded');

        try {
            // Check if we're on the processing page
            const processingContainer = document.querySelector('.processing-container');
            
            if (!processingContainer) {
                logActivity('Not on processing page, skipping initialization');
                return;
            }

            // Create and initialize processor
            const processor = new PaymentProcessor();
            
            if (processor.init()) {
                logActivity('Payment processor initialized successfully');
                setupEventListeners();
            } else {
                throw new Error('Failed to initialize payment processor');
            }

        } catch (error) {
            handleError(error);
        }
    }

    /* ============================================================
       7. PAGE LOAD
       ============================================================ */

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', init);
    } else {
        init();
    }

    // Prevent accidental page navigation during processing
    window.addEventListener('beforeunload', function(e) {
        const processingContainer = document.querySelector('.processing-container');
        
        if (processingContainer && processingContainer.style.display !== 'none') {
            e.preventDefault();
            e.returnValue = 'Payment is still processing. Are you sure you want to leave?';
            return e.returnValue;
        }
    });

})();