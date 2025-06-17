/**
 * Калькулятор стоимости мебели
 * Обрабатывает форму расчета и выводит примерную стоимость
 */

document.addEventListener('DOMContentLoaded', function() {
    // Инициализация калькулятора
    const calculatorForm = document.querySelector('.calculator-form');
    if (calculatorForm) {
        initCalculator();
    }

    function initCalculator() {
        // Элементы формы
        const productTypeSelect = document.getElementById('product-type');
        const materialSelect = document.getElementById('material');
        const sizeInput = document.getElementById('size');
        const calculateBtn = calculatorForm.querySelector('button[type="submit"]');
        const resultElement = document.getElementById('result');

        // Базовая стоимость для разных типов мебели (руб за м²)
        const basePrices = {
            'kitchen': 15000,
            'wardrobe': 8000,
            'living-room': 12000,
            'other': 10000
        };

        // Коэффициенты для материалов
        const materialCoefficients = {
            'ldsp': 1.0,
            'mdf': 1.3,
            'wood': 2.5
        };

        // Минимальные цены для каждого типа
        const minPrices = {
            'kitchen': 50000,
            'wardrobe': 20000,
            'living-room': 40000,
            'other': 30000
        };

        // Обработчик отправки формы
        calculatorForm.addEventListener('submit', function(e) {
            e.preventDefault();
            calculatePrice();
        });

        // Обработчики изменений полей
        productTypeSelect.addEventListener('change', calculatePrice);
        materialSelect.addEventListener('change', calculatePrice);
        sizeInput.addEventListener('input', calculatePrice);

        // Функция расчета стоимости
        function calculatePrice() {
            // Получаем значения из формы
            const productType = productTypeSelect.value;
            const material = materialSelect.value;
            let size = parseFloat(sizeInput.value) || 1;

            // Проверка минимального размера
            if (size < 1) {
                size = 1;
                sizeInput.value = 1;
            }

            // Рассчитываем базовую стоимость
            let price = basePrices[productType] * size * materialCoefficients[material];

            // Проверяем минимальную цену
            if (price < minPrices[productType]) {
                price = minPrices[productType];
            }

            // Округляем до тысяч
            price = Math.round(price / 1000) * 1000;

            // Форматируем число с пробелами между тысячами
            const formattedPrice = new Intl.NumberFormat('ru-RU').format(price);

            // Выводим результат
            resultElement.textContent = formattedPrice;

            // Анимация изменения цены
            animateResult();
        }

        // Анимация изменения цены
        function animateResult() {
            resultElement.style.transform = 'scale(1.1)';
            setTimeout(() => {
                resultElement.style.transform = 'scale(1)';
            }, 300);
        }

        // Инициализируем расчет при загрузке
        calculatePrice();
    }

    // Модуль для работы с модальными окнами (можно вынести в отдельный файл)
    const modalTriggers = document.querySelectorAll('.callback-btn, .product-card .btn--primary');
    modalTriggers.forEach(trigger => {
        trigger.addEventListener('click', function() {
            const modalId = this.dataset.modal || 'callback-modal';
            const modal = document.getElementById(modalId);
            if (modal) {
                openModal(modal);
            }
        });
    });

    function openModal(modal) {
        modal.style.display = 'flex';
        document.body.style.overflow = 'hidden';
        
        const closeBtn = modal.querySelector('.modal__close');
        if (closeBtn) {
            closeBtn.addEventListener('click', () => closeModal(modal));
        }
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                closeModal(modal);
            }
        });
    }

    function closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = '';
    }
});