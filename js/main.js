/**
 * Включает общую функциональность для всех страниц:
 * - Мобильное меню
 * - Модальные окна
 * - Плавная прокрутка
 * - Обработчики форм
 * - Общие эффекты и анимации
 */

document.addEventListener('DOMContentLoaded', function() {
    
    // Мобильное меню
    
    const burger = document.querySelector('.burger');
    const nav = document.querySelector('.nav');
    const navClose = document.querySelector('.nav__close');
    const navLinks = document.querySelectorAll('.nav__link');
    
    // Открытие/закрытие мобильного меню
    if (burger && nav) {
        burger.addEventListener('click', function() {
            nav.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
        
        navClose.addEventListener('click', function() {
            nav.classList.remove('active');
            document.body.style.overflow = '';
        });
        
        // Закрытие меню при клике на ссылку
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                nav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });
    }
    
    
    // Модальные окна
    
    const modalTriggers = document.querySelectorAll('[data-modal]');
    const modals = document.querySelectorAll('.modal');
    const modalCloseButtons = document.querySelectorAll('.modal__close');
    
    // Открытие модального окна
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function(e) {
            e.preventDefault();
            const modalId = this.getAttribute('data-modal');
            const modal = document.getElementById(modalId);
            
            if (modal) {
                modal.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        });
    });
    
    // Закрытие модального окна
    modalCloseButtons.forEach(btn => {
        btn.addEventListener('click', function() {
            const modal = this.closest('.modal');
            modal.classList.remove('active');
            document.body.style.overflow = '';
        });
    });
    
    // Закрытие при клике вне окна
    modals.forEach(modal => {
        modal.addEventListener('click', function(e) {
            if (e.target === this) {
                this.classList.remove('active');
                document.body.style.overflow = '';
            }
        });
    });
    
    // Закрытие по ESC
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            modals.forEach(modal => {
                modal.classList.remove('active');
                document.body.style.overflow = '';
            });
        }
    });
    
    
    // Плавная прокрутка 
    
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Закрываем меню, если оно открыто
                if (nav.classList.contains('active')) {
                    nav.classList.remove('active');
                    document.body.style.overflow = '';
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    
    // Обработка форм
    
    const forms = document.querySelectorAll('form');
    
    forms.forEach(form => {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = new FormData(this);
            const formType = this.classList.contains('callback-form') ? 'callback' : 
                            this.classList.contains('order-form') ? 'order' : 'other';
            
            // Валидация формы
            if (!validateForm(this)) {
                return;
            }
            
            // Создаем объект для отправки
            const data = {};
            formData.forEach((value, key) => {
                data[key] = value;
            });
            
            // Здесь должна быть реальная отправка на сервер
            console.log('Отправка формы:', formType, data);
            
            // Показываем сообщение об успехе
            showSuccessMessage(this, 'Ваша заявка отправлена! Мы свяжемся с вами в ближайшее время.');
            
            // Закрываем модальное окно, если форма в нем
            const modal = this.closest('.modal');
            if (modal) {
                setTimeout(() => {
                    modal.classList.remove('active');
                    document.body.style.overflow = '';
                }, 2000);
            }
            
            // Очищаем форму
            this.reset();
        });
    });
    
    // Функция валидации формы
    function validateForm(form) {
        let isValid = true;
        const requiredFields = form.querySelectorAll('[required]');
        
        requiredFields.forEach(field => {
            if (!field.value.trim()) {
                field.classList.add('error');
                isValid = false;
            } else {
                field.classList.remove('error');
            }
            
            // Валидация email
            if (field.type === 'email' && !isValidEmail(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
            
            // Валидация телефона
            if (field.type === 'tel' && !isValidPhone(field.value)) {
                field.classList.add('error');
                isValid = false;
            }
        });
        
        return isValid;
    }
    
    // Проверка email
    function isValidEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }
    
    // Проверка телефона (минимально - 11 цифр)
    function isValidPhone(phone) {
        const digits = phone.replace(/\D/g, '');
        return digits.length >= 11;
    }
    
    // Показать сообщение об успехе
    function showSuccessMessage(form, message) {
        const successDiv = document.createElement('div');
        successDiv.className = 'form-success';
        successDiv.textContent = message;
        
        const submitButton = form.querySelector('button[type="submit"]');
        if (submitButton) {
            form.insertBefore(successDiv, submitButton.nextSibling);
            
            // Удаляем сообщение через 5 секунд
            setTimeout(() => {
                successDiv.remove();
            }, 5000);
        }
    }
    
    
    // Фиксированный header при скролле
    
    const header = document.querySelector('.header');
    if (header) {
        let lastScroll = 0;
        
        window.addEventListener('scroll', function() {
            const currentScroll = window.pageYOffset;
            
            if (currentScroll > 100) {
                header.classList.add('scrolled');
                
                if (currentScroll > lastScroll && !nav.classList.contains('active')) {
                    header.classList.add('hidden');
                } else {
                    header.classList.remove('hidden');
                }
            } else {
                header.classList.remove('scrolled');
                header.classList.remove('hidden');
            }
            
            lastScroll = currentScroll;
        });
    }
    
    
    
    
    // Анимации при скролле
    
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    function checkAnimation() {
        animateElements.forEach(element => {
            const elementPosition = element.getBoundingClientRect().top;
            const windowHeight = window.innerHeight;
            
            if (elementPosition < windowHeight - 100) {
                element.classList.add('animated');
            }
        });
    }
    
    if (animateElements.length > 0) {
        window.addEventListener('scroll', checkAnimation);
        window.addEventListener('load', checkAnimation);
    }
    
    
    // Обработка цифровых счетчиков
    
    const counterElements = document.querySelectorAll('.counter');
    
    if (counterElements.length > 0) {
        counterElements.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            const duration = +counter.getAttribute('data-duration') || 2000;
            const step = target / (duration / 16); 
            
            let current = 0;
            
            const updateCounter = () => {
                current += step;
                if (current < target) {
                    counter.textContent = Math.ceil(current);
                    requestAnimationFrame(updateCounter);
                } else {
                    counter.textContent = target;
                }
            };
            
            // анимация при появлении в viewport
            const observer = new IntersectionObserver((entries) => {
                if (entries[0].isIntersecting) {
                    updateCounter();
                    observer.unobserve(counter);
                }
            });
            
            observer.observe(counter);
        });
    }
    
    
    // Инициализация фильтров в каталоге 
    
    const filterToggle = document.querySelector('.filter-toggle');
    const catalogFilters = document.querySelector('.catalog-filters');
    
    if (filterToggle && catalogFilters) {
        filterToggle.addEventListener('click', function() {
            catalogFilters.classList.toggle('active');
        });
        
        document.querySelector('.catalog-filters__close').addEventListener('click', function() {
            catalogFilters.classList.remove('active');
        });
    }
    
    
    
    // Полифилл для forEach в NodeList
    if (window.NodeList && !NodeList.prototype.forEach) {
        NodeList.prototype.forEach = Array.prototype.forEach;
    }
    
    // Полифилл для closest()
    if (!Element.prototype.matches) {
        Element.prototype.matches = 
            Element.prototype.msMatchesSelector || 
            Element.prototype.webkitMatchesSelector;
    }
    
    if (!Element.prototype.closest) {
        Element.prototype.closest = function(s) {
            let el = this;
            do {
                if (el.matches(s)) return el;
                el = el.parentElement || el.parentNode;
            } while (el !== null && el.nodeType === 1);
            return null;
        };
    }
});