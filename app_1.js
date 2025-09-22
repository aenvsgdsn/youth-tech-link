// Youth Tech Link Website JavaScript - FIXED VERSION
// Mobile-first interactive functionality with proper admin access

class YouthTechLink {
    constructor() {
        this.currentStep = 1;
        this.totalSteps = 3;
        this.formData = {};
        this.registrations = this.loadRegistrations();
        this.adminCredentials = {
            username: 'admin',
            password: 'society123'
        };
        
        this.init();
    }

    init() {
        this.bindEvents();
        this.updateFormDisplay();
        this.setupRealTimeValidation();
        this.animateOnScroll();
        this.setupMobileNavigation();
        this.initializeAdminAccess();
    }

    initializeAdminAccess() {
        // Ensure admin button is visible and functional
        const adminBtn = document.getElementById('adminLoginBtn');
        if (adminBtn) {
            adminBtn.style.display = 'inline-flex';
            adminBtn.style.visibility = 'visible';
            console.log('Admin login button initialized');
        }

        // Add keyboard shortcut for admin access
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'A') {
                e.preventDefault();
                this.showAdminLogin();
            }
        });

        // Add secret click sequence on logo for admin access
        let clickCount = 0;
        const logo = document.querySelector('.nav-brand h2');
        if (logo) {
            logo.addEventListener('click', () => {
                clickCount++;
                if (clickCount >= 5) {
                    this.showAdminLogin();
                    clickCount = 0;
                }
                setTimeout(() => {
                    clickCount = 0;
                }, 3000);
            });
            logo.style.cursor = 'pointer';
        }
    }

    bindEvents() {
        // Registration form navigation
        const nextBtn = document.getElementById('nextBtn');
        const prevBtn = document.getElementById('prevBtn');
        const form = document.getElementById('registrationForm');
        
        if (nextBtn) {
            nextBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.nextStep();
            });
        }
        
        if (prevBtn) {
            prevBtn.addEventListener('click', (e) => {
                e.preventDefault();
                this.prevStep();
            });
        }
        
        if (form) {
            form.addEventListener('submit', (e) => this.handleSubmit(e));
        }

        // Admin functionality - FIXED EVENT BINDING
        const adminLoginBtn = document.getElementById('adminLoginBtn');
        if (adminLoginBtn) {
            adminLoginBtn.addEventListener('click', (e) => {
                e.preventDefault();
                console.log('Admin login button clicked');
                this.showAdminLogin();
            });
        }

        const adminLoginForm = document.getElementById('adminLoginForm');
        if (adminLoginForm) {
            adminLoginForm.addEventListener('submit', (e) => this.handleAdminLogin(e));
        }

        const closeAdminModal = document.getElementById('closeAdminModal');
        if (closeAdminModal) {
            closeAdminModal.addEventListener('click', () => this.hideAdminLogin());
        }

        const closeAdminDashboard = document.getElementById('closeAdminDashboard');
        if (closeAdminDashboard) {
            closeAdminDashboard.addEventListener('click', () => this.hideAdminDashboard());
        }

        // Admin dashboard search and filter
        const adminSearchInput = document.getElementById('adminSearchInput');
        const adminDepartmentFilter = document.getElementById('adminDepartmentFilter');
        
        if (adminSearchInput) {
            adminSearchInput.addEventListener('input', () => this.filterAdminSubmissions());
        }
        
        if (adminDepartmentFilter) {
            adminDepartmentFilter.addEventListener('change', () => this.filterAdminSubmissions());
        }

        // Step indicators
        document.querySelectorAll('.step').forEach(step => {
            step.addEventListener('click', (e) => {
                const stepNumber = parseInt(e.target.getAttribute('data-step'));
                if (stepNumber && stepNumber <= this.currentStep + 1) {
                    this.goToStep(stepNumber);
                }
            });
        });

        // Modal close on outside click
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.hideAllModals();
            }
        });

        // Smooth scroll for navigation links
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href');
                const targetElement = document.querySelector(targetId);
                if (targetElement) {
                    targetElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                    this.closeMobileMenu();
                }
            });
        });
    }

    setupMobileNavigation() {
        const navToggle = document.getElementById('navToggle');
        const navMenu = document.querySelector('.nav-menu');
        
        if (navToggle && navMenu) {
            navToggle.addEventListener('click', () => {
                const isActive = navMenu.classList.contains('active');
                if (isActive) {
                    this.closeMobileMenu();
                } else {
                    this.openMobileMenu();
                }
            });
        }

        // Add mobile menu styles
        this.addMobileNavStyles();
    }

    openMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu) {
            navMenu.classList.add('active');
            navMenu.style.display = 'flex';
        }
        if (navToggle) navToggle.classList.add('active');
        document.body.classList.add('nav-open');
    }

    closeMobileMenu() {
        const navMenu = document.querySelector('.nav-menu');
        const navToggle = document.getElementById('navToggle');
        
        if (navMenu) {
            navMenu.classList.remove('active');
            // Don't hide completely on desktop
            if (window.innerWidth <= 767) {
                setTimeout(() => {
                    if (!navMenu.classList.contains('active')) {
                        navMenu.style.display = '';
                    }
                }, 300);
            }
        }
        if (navToggle) navToggle.classList.remove('active');
        document.body.classList.remove('nav-open');
    }

    addMobileNavStyles() {
        if (!document.getElementById('mobile-nav-styles')) {
            const style = document.createElement('style');
            style.id = 'mobile-nav-styles';
            style.textContent = `
                @media (max-width: 767px) {
                    .nav-menu {
                        position: fixed;
                        top: 60px;
                        left: 0;
                        right: 0;
                        background: rgba(var(--color-slate-900-rgb, 19, 52, 59), 0.98);
                        backdrop-filter: blur(10px);
                        display: none !important;
                        flex-direction: column;
                        padding: var(--space-20);
                        gap: var(--space-16);
                        transform: translateY(-100%);
                        opacity: 0;
                        transition: all var(--duration-normal) var(--ease-standard);
                        z-index: 999;
                        border-bottom: 1px solid var(--color-border);
                    }
                    
                    .nav-menu.active {
                        display: flex !important;
                        transform: translateY(0);
                        opacity: 1;
                    }
                    
                    .nav-toggle {
                        display: flex !important;
                    }
                    
                    .nav-toggle.active span:nth-child(1) {
                        transform: rotate(45deg) translate(5px, 5px);
                    }
                    
                    .nav-toggle.active span:nth-child(2) {
                        opacity: 0;
                    }
                    
                    .nav-toggle.active span:nth-child(3) {
                        transform: rotate(-45deg) translate(7px, -6px);
                    }
                    
                    body.nav-open {
                        overflow: hidden;
                    }
                    
                    .nav-link {
                        padding: var(--space-12);
                        border-bottom: 1px solid var(--color-border);
                        width: 100%;
                        text-align: center;
                    }
                    
                    #adminLoginBtn {
                        margin-top: var(--space-8);
                        align-self: center;
                    }
                }
                
                @media (min-width: 768px) {
                    .nav-toggle {
                        display: none !important;
                    }
                    
                    .nav-menu {
                        display: flex !important;
                        position: static;
                        flex-direction: row;
                        background: none;
                        backdrop-filter: none;
                        padding: 0;
                        transform: none;
                        opacity: 1;
                        border: none;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    setupRealTimeValidation() {
        const fields = ['fullName', 'email', 'phone', 'registrationNumber', 'department', 'year'];
        
        fields.forEach(fieldName => {
            const field = document.getElementById(fieldName);
            if (field) {
                field.addEventListener('input', () => this.validateField(fieldName));
                field.addEventListener('blur', () => this.validateField(fieldName));
            }
        });
    }

    validateField(fieldName) {
        const field = document.getElementById(fieldName);
        if (!field) return true;
        
        const errorElement = field.parentElement.querySelector('.error-message');
        let isValid = true;
        let errorMessage = '';

        // Remove previous states
        field.classList.remove('error', 'valid');
        if (errorElement) {
            errorElement.classList.remove('show');
        }

        const value = field.value.trim();

        switch (fieldName) {
            case 'fullName':
                if (!value) {
                    errorMessage = 'Full name is required';
                    isValid = false;
                } else if (value.length < 2) {
                    errorMessage = 'Name must be at least 2 characters';
                    isValid = false;
                } else if (!/^[a-zA-Z\s]+$/.test(value)) {
                    errorMessage = 'Name should only contain letters and spaces';
                    isValid = false;
                }
                break;

            case 'email':
                const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                if (!value) {
                    errorMessage = 'Email is required';
                    isValid = false;
                } else if (!emailRegex.test(value)) {
                    errorMessage = 'Please enter a valid email address';
                    isValid = false;
                } else if (this.isDuplicateEmail(value)) {
                    errorMessage = 'This email is already registered';
                    isValid = false;
                }
                break;

            case 'phone':
                const phoneRegex = /^[\+]?[0-9]{10,15}$/;
                if (!value) {
                    errorMessage = 'Phone number is required';
                    isValid = false;
                } else if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
                    errorMessage = 'Please enter a valid phone number (10-15 digits)';
                    isValid = false;
                }
                break;

            case 'registrationNumber':
                if (!value) {
                    errorMessage = 'Registration number is required';
                    isValid = false;
                } else if (value.length < 3) {
                    errorMessage = 'Registration number must be at least 3 characters';
                    isValid = false;
                } else if (this.isDuplicateRegistration(value)) {
                    errorMessage = 'This registration number already exists';
                    isValid = false;
                }
                break;

            case 'department':
            case 'year':
                if (!value) {
                    errorMessage = 'This field is required';
                    isValid = false;
                }
                break;
        }

        if (isValid && value) {
            field.classList.add('valid');
            this.addCheckmark(field);
        } else if (!isValid) {
            field.classList.add('error');
            if (errorElement) {
                errorElement.textContent = errorMessage;
                errorElement.classList.add('show');
            }
            this.removeCheckmark(field);
        } else {
            this.removeCheckmark(field);
        }

        return isValid;
    }

    addCheckmark(field) {
        this.removeCheckmark(field);
        const checkmark = document.createElement('i');
        checkmark.className = 'fas fa-check-circle field-checkmark';
        checkmark.style.cssText = `
            position: absolute;
            right: 12px;
            top: 50%;
            transform: translateY(-50%);
            color: var(--color-success);
            pointer-events: none;
            opacity: 0;
            animation: fadeIn 0.3s ease-out forwards;
            z-index: 10;
        `;
        field.parentElement.style.position = 'relative';
        field.parentElement.appendChild(checkmark);
    }

    removeCheckmark(field) {
        const existing = field.parentElement.querySelector('.field-checkmark');
        if (existing) {
            existing.remove();
        }
    }

    isDuplicateEmail(email) {
        return this.registrations.some(reg => 
            reg.email.toLowerCase() === email.toLowerCase()
        );
    }

    isDuplicateRegistration(regNumber) {
        return this.registrations.some(reg => 
            reg.registration_number.toLowerCase() === regNumber.toLowerCase()
        );
    }

    validateCurrentStep() {
        return this.validateStep(this.currentStep);
    }

    validateStep(stepNumber) {
        const stepElement = document.querySelector(`.form-step[data-step="${stepNumber}"]`);
        if (!stepElement) return true;
        
        const requiredFields = stepElement.querySelectorAll('[required]');
        let isValid = true;

        requiredFields.forEach(field => {
            const fieldName = field.name || field.id;
            if (field.type === 'checkbox') {
                if (!field.checked) {
                    isValid = false;
                    this.showFieldError(field, 'You must agree to join Youth Tech Link');
                }
            } else if (fieldName && !this.validateField(fieldName)) {
                isValid = false;
            }
        });

        return isValid;
    }

    showFieldError(field, message) {
        let errorElement = field.parentElement.querySelector('.error-message');
        if (!errorElement) {
            errorElement = document.createElement('span');
            errorElement.className = 'error-message';
            field.parentElement.appendChild(errorElement);
        }
        errorElement.textContent = message;
        errorElement.classList.add('show');
        
        field.style.borderColor = 'var(--color-error)';
        field.style.animation = 'shake 0.5s ease-in-out';
        
        setTimeout(() => {
            field.style.animation = '';
        }, 500);
    }

    goToStep(stepNumber) {
        if (stepNumber < this.currentStep || this.validateStepsUpTo(stepNumber - 1)) {
            this.currentStep = stepNumber;
            this.updateFormDisplay();
            this.animateStepTransition('direct');
        }
    }

    validateStepsUpTo(stepNumber) {
        for (let i = 1; i <= stepNumber; i++) {
            if (!this.validateStep(i)) {
                return false;
            }
        }
        return true;
    }

    nextStep() {
        if (!this.validateCurrentStep()) {
            this.showStepError();
            return;
        }

        if (this.currentStep < this.totalSteps) {
            this.saveCurrentStepData();
            this.currentStep++;
            this.updateFormDisplay();
            this.animateStepTransition('next');
        }
    }

    prevStep() {
        if (this.currentStep > 1) {
            this.currentStep--;
            this.updateFormDisplay();
            this.animateStepTransition('prev');
        }
    }

    saveCurrentStepData() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (!currentStepElement) return;
        
        const fields = currentStepElement.querySelectorAll('.form-control, input[type="checkbox"]');
        
        fields.forEach(field => {
            const fieldName = field.name || field.id;
            if (fieldName) {
                if (field.type === 'checkbox') {
                    this.formData[fieldName] = field.checked;
                } else {
                    this.formData[fieldName] = field.value;
                }
            }
        });
    }

    showStepError() {
        const currentStepElement = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (currentStepElement) {
            currentStepElement.style.animation = 'shake 0.5s ease-in-out';
            
            setTimeout(() => {
                currentStepElement.style.animation = '';
            }, 500);
        }
    }

    animateStepTransition(direction) {
        const steps = document.querySelectorAll('.form-step');
        
        // Hide all steps
        steps.forEach(step => {
            step.classList.remove('active');
        });

        // Show current step
        const activeStep = document.querySelector(`.form-step[data-step="${this.currentStep}"]`);
        if (activeStep) {
            setTimeout(() => {
                activeStep.classList.add('active');
            }, 50);
        }
    }

    updateFormDisplay() {
        // Update progress bar
        const progressFill = document.querySelector('.progress-fill');
        if (progressFill) {
            const progressPercentage = (this.currentStep / this.totalSteps) * 100;
            progressFill.style.width = `${progressPercentage}%`;
        }

        // Update step indicators
        document.querySelectorAll('.step').forEach((step, index) => {
            const stepNumber = index + 1;
            step.classList.remove('active', 'completed');
            
            if (stepNumber === this.currentStep) {
                step.classList.add('active');
                step.textContent = stepNumber;
            } else if (stepNumber < this.currentStep) {
                step.classList.add('completed');
                step.innerHTML = '<i class="fas fa-check"></i>';
            } else {
                step.textContent = stepNumber;
            }
        });

        // Update navigation buttons
        const prevBtn = document.getElementById('prevBtn');
        const nextBtn = document.getElementById('nextBtn');
        const submitBtn = document.getElementById('submitBtn');

        if (prevBtn) {
            prevBtn.style.display = this.currentStep === 1 ? 'none' : 'flex';
        }
        
        if (nextBtn && submitBtn) {
            if (this.currentStep === this.totalSteps) {
                nextBtn.style.display = 'none';
                submitBtn.style.display = 'flex';
            } else {
                nextBtn.style.display = 'flex';
                submitBtn.style.display = 'none';
            }
        }

        this.animateStepTransition('direct');
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        if (!this.validateCurrentStep()) {
            this.showStepError();
            return;
        }

        this.saveCurrentStepData();
        await this.submitForm();
    }

    async submitForm() {
        const submitBtn = document.getElementById('submitBtn');
        if (!submitBtn) return;
        
        // Show loading state
        submitBtn.classList.add('loading');
        submitBtn.disabled = true;

        try {
            // Simulate form submission delay
            await this.delay(2000);
            
            // Collect form data
            const formData = {
                id: Date.now(),
                name: this.formData.fullName || document.getElementById('fullName')?.value || '',
                email: this.formData.email || document.getElementById('email')?.value || '',
                phone: this.formData.phone || document.getElementById('phone')?.value || '',
                registration_number: this.formData.registrationNumber || document.getElementById('registrationNumber')?.value || '',
                department: this.formData.department || document.getElementById('department')?.value || '',
                semester: this.formData.year || document.getElementById('year')?.value || '',
                address: this.formData.address || document.getElementById('address')?.value || '',
                date: new Date().toISOString().split('T')[0],
                timestamp: Date.now()
            };
            
            // Add to registrations
            this.registrations.unshift(formData);
            this.saveRegistrations();
            
            this.showSuccessMessage();
            
        } catch (error) {
            this.showErrorMessage('Registration failed. Please try again.');
        } finally {
            submitBtn.classList.remove('loading');
            submitBtn.disabled = false;
        }
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    showSuccessMessage() {
        const form = document.querySelector('.registration-form');
        const successMessage = document.getElementById('successMessage');
        
        if (form) form.style.display = 'none';
        if (successMessage) {
            successMessage.classList.remove('hidden');
            this.createConfetti();
        }
    }

    createConfetti() {
        const colors = ['#1FB8CD', '#FFC185', '#B4413C', '#5D878F', '#DB4545'];
        const confettiCount = 50;
        
        for (let i = 0; i < confettiCount; i++) {
            setTimeout(() => {
                const confetti = document.createElement('div');
                confetti.style.cssText = `
                    position: fixed;
                    top: -10px;
                    left: ${Math.random() * 100}%;
                    width: 8px;
                    height: 8px;
                    background: ${colors[Math.floor(Math.random() * colors.length)]};
                    border-radius: 50%;
                    z-index: 9999;
                    pointer-events: none;
                    animation: confettiFall 3s linear forwards;
                `;
                
                document.body.appendChild(confetti);
                
                setTimeout(() => confetti.remove(), 3000);
            }, i * 100);
        }
        
        // Add confetti animation if not exists
        if (!document.getElementById('confetti-style')) {
            const style = document.createElement('style');
            style.id = 'confetti-style';
            style.textContent = `
                @keyframes confettiFall {
                    to {
                        transform: translateY(100vh) rotate(360deg);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }

    showErrorMessage(message) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'error-notification';
        errorDiv.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: var(--color-error);
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
            word-wrap: break-word;
        `;
        errorDiv.textContent = message;
        
        document.body.appendChild(errorDiv);
        
        setTimeout(() => {
            errorDiv.style.animation = 'slideInLeft 0.3s ease-out reverse';
            setTimeout(() => errorDiv.remove(), 300);
        }, 4000);
    }

    // Admin functionality - FIXED IMPLEMENTATION
    showAdminLogin() {
        console.log('Showing admin login modal');
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => {
                const usernameField = document.getElementById('adminUsername');
                if (usernameField) {
                    usernameField.focus();
                }
            }, 100);
            this.showNotification('Admin login opened. Use Ctrl+Shift+A or click the YTL logo 5 times for quick access.', 'info');
        } else {
            console.error('Admin modal not found');
        }
    }

    hideAdminLogin() {
        const modal = document.getElementById('adminModal');
        if (modal) {
            modal.classList.add('hidden');
            const form = document.getElementById('adminLoginForm');
            if (form) form.reset();
        }
    }

    hideAdminDashboard() {
        const modal = document.getElementById('adminDashboard');
        if (modal) {
            modal.classList.add('hidden');
        }
    }

    hideAllModals() {
        this.hideAdminLogin();
        this.hideAdminDashboard();
    }

    handleAdminLogin(e) {
        e.preventDefault();
        
        const username = document.getElementById('adminUsername').value;
        const password = document.getElementById('adminPassword').value;
        
        console.log('Admin login attempt:', username);
        
        if (username === this.adminCredentials.username && password === this.adminCredentials.password) {
            this.hideAdminLogin();
            this.showAdminDashboard();
            this.showNotification('Admin login successful!', 'success');
        } else {
            this.showErrorMessage('Invalid admin credentials. Try username: admin, password: society123');
        }
    }

    showAdminDashboard() {
        console.log('Showing admin dashboard');
        const modal = document.getElementById('adminDashboard');
        if (modal) {
            modal.classList.remove('hidden');
            this.updateAdminStats();
            this.populateAdminTable();
        }
    }

    updateAdminStats() {
        const total = this.registrations.length;
        const today = new Date().toISOString().split('T')[0];
        const todayCount = this.registrations.filter(reg => reg.date === today).length;
        
        const totalElement = document.getElementById('totalRegistrations');
        const todayElement = document.getElementById('todayRegistrations');
        
        if (totalElement) totalElement.textContent = total;
        if (todayElement) todayElement.textContent = todayCount;
    }

    populateAdminTable() {
        const tbody = document.getElementById('adminSubmissionsTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (this.registrations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 32px; color: var(--color-text-secondary);">
                        <i class="fas fa-users" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                        No registrations found
                    </td>
                </tr>
            `;
            return;
        }

        this.registrations.forEach((reg, index) => {
            const row = document.createElement('tr');
            row.style.animationDelay = `${index * 0.05}s`;
            
            row.innerHTML = `
                <td>${reg.name}</td>
                <td>${reg.email}</td>
                <td>${reg.phone}</td>
                <td>${reg.registration_number}</td>
                <td>${reg.department}</td>
                <td>${reg.semester}</td>
                <td>${reg.date}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    filterAdminSubmissions() {
        const searchInput = document.getElementById('adminSearchInput');
        const departmentFilter = document.getElementById('adminDepartmentFilter');
        
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        const departmentValue = departmentFilter ? departmentFilter.value : '';
        
        let filteredRegistrations = [...this.registrations];

        if (searchTerm) {
            filteredRegistrations = filteredRegistrations.filter(reg =>
                reg.name.toLowerCase().includes(searchTerm) ||
                reg.email.toLowerCase().includes(searchTerm) ||
                reg.registration_number.toLowerCase().includes(searchTerm)
            );
        }

        if (departmentValue) {
            filteredRegistrations = filteredRegistrations.filter(reg =>
                reg.department === departmentValue
            );
        }

        this.displayFilteredAdminSubmissions(filteredRegistrations);
    }

    displayFilteredAdminSubmissions(registrations) {
        const tbody = document.getElementById('adminSubmissionsTable');
        if (!tbody) return;
        
        tbody.innerHTML = '';

        if (registrations.length === 0) {
            tbody.innerHTML = `
                <tr>
                    <td colspan="7" style="text-align: center; padding: 32px; color: var(--color-text-secondary);">
                        <i class="fas fa-search" style="font-size: 24px; margin-bottom: 8px; display: block;"></i>
                        No registrations found matching your criteria
                    </td>
                </tr>
            `;
            return;
        }

        registrations.forEach((reg, index) => {
            const row = document.createElement('tr');
            row.style.animationDelay = `${index * 0.05}s`;
            
            row.innerHTML = `
                <td>${this.highlightText(reg.name)}</td>
                <td>${this.highlightText(reg.email)}</td>
                <td>${reg.phone}</td>
                <td>${this.highlightText(reg.registration_number)}</td>
                <td>${reg.department}</td>
                <td>${reg.semester}</td>
                <td>${reg.date}</td>
            `;
            
            tbody.appendChild(row);
        });
    }

    highlightText(text) {
        const searchInput = document.getElementById('adminSearchInput');
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : '';
        if (!searchTerm || !text) return text;
        
        const regex = new RegExp(`(${searchTerm})`, 'gi');
        return text.replace(regex, '<mark style="background: var(--color-bg-2); padding: 2px;">$1</mark>');
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        
        const bgColor = type === 'success' ? 'var(--color-success)' : 
                       type === 'error' ? 'var(--color-error)' : 
                       'var(--color-info)';
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${bgColor};
            color: white;
            padding: 16px 20px;
            border-radius: 8px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.15);
            z-index: 9999;
            animation: slideInRight 0.3s ease-out;
            max-width: 350px;
            word-wrap: break-word;
            font-size: var(--font-size-sm);
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideInLeft 0.3s ease-out reverse';
            setTimeout(() => notification.remove(), 300);
        }, 5000);
    }

    // Data persistence
    loadRegistrations() {
        try {
            const stored = localStorage.getItem('ytl-registrations');
            if (stored) {
                return JSON.parse(stored);
            }
        } catch (error) {
            console.warn('Could not load registrations from localStorage');
        }
        
        // Return sample data for demo
        return [
            {
                id: 1,
                name: "Ahmad Hassan",
                email: "ahmad.hassan@student.paf-iast.edu.pk",
                phone: "+92-300-1234567",
                registration_number: "PAF2023001",
                department: "Computer Science",
                semester: "3rd Semester",
                address: "Islamabad, Pakistan",
                date: "2025-01-20",
                timestamp: Date.now() - 86400000
            },
            {
                id: 2,
                name: "Fatima Ali",
                email: "fatima.ali@student.paf-iast.edu.pk",
                phone: "+92-301-2345678",
                registration_number: "PAF2023002",
                department: "Software Engineering",
                semester: "5th Semester",
                address: "Rawalpindi, Pakistan",
                date: "2025-01-21",
                timestamp: Date.now() - 43200000
            },
            {
                id: 3,
                name: "Muhammad Usman",
                email: "m.usman@student.paf-iast.edu.pk",
                phone: "+92-302-3456789",
                registration_number: "PAF2023003",
                department: "Information Technology",
                semester: "2nd Semester",
                address: "Haripur, Pakistan",
                date: "2025-01-21",
                timestamp: Date.now() - 21600000
            }
        ];
    }

    saveRegistrations() {
        try {
            localStorage.setItem('ytl-registrations', JSON.stringify(this.registrations));
        } catch (error) {
            console.warn('Could not save registrations to localStorage');
        }
    }

    // Animation and UX enhancements
    animateOnScroll() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };
        
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    entry.target.classList.add('animated');
                }
            });
        }, observerOptions);
        
        // Observe sections for scroll animations
        document.querySelectorAll('section, .leader-card, .objective-card, .program-card').forEach(el => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(20px)';
            el.style.transition = 'all 0.6s ease-out';
            observer.observe(el);
        });

        // Stagger animations for cards
        setTimeout(() => {
            document.querySelectorAll('.leadership-grid .leader-card').forEach((card, index) => {
                card.style.transitionDelay = `${index * 0.1}s`;
            });
            
            document.querySelectorAll('.objectives-grid .objective-card').forEach((card, index) => {
                card.style.transitionDelay = `${index * 0.1}s`;
            });
            
            document.querySelectorAll('.programs-grid .program-card').forEach((card, index) => {
                card.style.transitionDelay = `${index * 0.2}s`;
            });
        }, 100);
    }

    addRippleEffect() {
        document.querySelectorAll('.btn').forEach(btn => {
            btn.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;
                
                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    background: rgba(255, 255, 255, 0.3);
                    border-radius: 50%;
                    transform: scale(0);
                    animation: ripple 0.6s ease-out;
                    pointer-events: none;
                `;
                
                this.style.position = 'relative';
                this.style.overflow = 'hidden';
                this.appendChild(ripple);
                
                setTimeout(() => ripple.remove(), 600);
            });
        });
        
        // Add ripple animation if not exists
        if (!document.getElementById('ripple-style')) {
            const style = document.createElement('style');
            style.id = 'ripple-style';
            style.textContent = `
                @keyframes ripple {
                    to {
                        transform: scale(2);
                        opacity: 0;
                    }
                }
            `;
            document.head.appendChild(style);
        }
    }
}

// Global functions
window.resetForm = function() {
    const form = document.querySelector('.registration-form');
    const successMessage = document.getElementById('successMessage');
    
    if (form) form.style.display = 'block';
    if (successMessage) successMessage.classList.add('hidden');
    
    // Reset form
    const formElement = document.getElementById('registrationForm');
    if (formElement) formElement.reset();
    
    // Reset to first step
    if (window.ytlInstance) {
        window.ytlInstance.currentStep = 1;
        window.ytlInstance.formData = {};
        window.ytlInstance.updateFormDisplay();
    }
    
    // Clear validation states
    document.querySelectorAll('.form-control').forEach(field => {
        field.classList.remove('error', 'valid');
        field.style.borderColor = '';
        field.style.animation = '';
        const checkmark = field.parentElement.querySelector('.field-checkmark');
        if (checkmark) checkmark.remove();
    });
    
    document.querySelectorAll('.error-message').forEach(msg => {
        msg.classList.remove('show');
    });
};

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Initializing Youth Tech Link website...');
    
    // Initialize main application
    window.ytlInstance = new YouthTechLink();
    
    // Add ripple effects
    window.ytlInstance.addRippleEffect();
    
    // Add smooth scroll behavior
    document.documentElement.style.scrollBehavior = 'smooth';
    
    // Handle navbar scroll effect
    let lastScrollTop = 0;
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        const currentScroll = window.pageYOffset || document.documentElement.scrollTop;
        
        if (currentScroll > lastScrollTop && currentScroll > 100) {
            navbar.style.transform = 'translateY(-100%)';
        } else {
            navbar.style.transform = 'translateY(0)';
        }
        
        lastScrollTop = currentScroll <= 0 ? 0 : currentScroll;
    });
    
    // Handle form field focus animations
    document.querySelectorAll('.form-control').forEach(control => {
        control.addEventListener('focus', function() {
            this.parentElement.style.transform = 'translateY(-2px)';
        });
        
        control.addEventListener('blur', function() {
            this.parentElement.style.transform = 'translateY(0)';
        });
    });
    
    // Add loading animation to page
    document.body.style.opacity = '0';
    document.body.style.transform = 'translateY(20px)';
    
    setTimeout(() => {
        document.body.style.transition = 'all 0.6s ease-out';
        document.body.style.opacity = '1';
        document.body.style.transform = 'translateY(0)';
    }, 100);
    
    // Enhanced keyboard navigation support
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            window.ytlInstance.hideAllModals();
            window.ytlInstance.closeMobileMenu();
        }
        
        // Admin access shortcut
        if (e.ctrlKey && e.shiftKey && e.key === 'A') {
            e.preventDefault();
            window.ytlInstance.showAdminLogin();
        }
    });
    
    // Show welcome notification with admin access info
    setTimeout(() => {
        window.ytlInstance.showNotification(
            'Welcome to Youth Tech Link! Admin access: Click "Admin" button, or press Ctrl+Shift+A, or click YTL logo 5 times.',
            'info'
        );
    }, 2000);
    
    console.log('✅ Youth Tech Link website initialized successfully!');
    console.log('🔑 Admin access methods:');
    console.log('   1. Click the "Admin" button in navigation');
    console.log('   2. Press Ctrl+Shift+A');
    console.log('   3. Click the "YTL" logo 5 times quickly');
    console.log('   📧 Username: admin | 🔒 Password: society123');
});