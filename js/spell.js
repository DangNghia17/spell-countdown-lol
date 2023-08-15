document.addEventListener("DOMContentLoaded", function () {
    // Get all image-select elements
    const imageSelects = document.querySelectorAll('.image-select');
    const startButtons = document.querySelectorAll('.start-button');
    const resetButtons = document.querySelectorAll('.reset-button');
    const countdownDisplays = document.querySelectorAll('.countdown-display');
    const container = document.querySelector('.alerts-container'); // Đảm bảo rằng bạn đã khai báo biến container và định nghĩa nó

    let isCountdownFinished = false;
    let countdownIntervals = new Array(startButtons.length);

    const ALERT_HEIGHT = 70; // Độ cao của mỗi alert

    function showAlert(message, laneName) {
        const alertElement = document.createElement('div');
        alertElement.classList.add('alert', 'alert-warning', 'position-absolute', 'end-0', 'mt-3', 'd-flex', 'justify-content-between', 'align-items-center', 'pl-2');

        const messageElement = document.createElement('h5');
        messageElement.style.color = 'black';
        messageElement.textContent = `${laneName} - ${message}`;
        alertElement.appendChild(messageElement);

        const closeButton = document.createElement('button');
        closeButton.classList.add('btn-close');
        closeButton.addEventListener('click', () => {
            container.removeChild(alertElement);
            updateAlertPositions(); // Gọi hàm để cập nhật vị trí của các alert
        });
        alertElement.appendChild(closeButton);

        container.appendChild(alertElement);
        updateAlertPositions(); // Gọi hàm để cập nhật vị trí của các alert
    }

    function updateAlertPositions() {
        const alerts = container.querySelectorAll('.alert');
        let top = 0;

        for (const alert of alerts) {
            alert.style.top = `${top}px`;
            top += ALERT_HEIGHT;
        }
    }

    function playSound() {
        sound = new Howl({
            src: ['sound/analog-timer.mp3'] // Thay đổi đường dẫn đến file âm thanh của bạn
        });

        sound.play();
    }

// Sử dụng showAlert trong hàm startCountdown
    function startCountdown(index) {
        const selectedValue = imageSelects[index].value;
        const selectedLaneName = imageSelects[index].selectedOptions[0].text; // Lấy tên của lane
        let timeLeft = valueToTimeLeft[selectedValue];

        countdownDisplays[index].textContent = timeLeft;
        isCountdownFinished = false;

        function update() {
            if (timeLeft === 0) {
                countdownDisplays[index].textContent = 'Đã hồi!';
                if (!isCountdownFinished) {
                    showAlert('Đã hồi', selectedLaneName); // Sử dụng showAlert với thông tin của lane
                    isCountdownFinished = true;
                }
                return;
            }

            if (timeLeft <= 20 && !isCountdownFinished) {
                showAlert(`Sắp hồi spell`, selectedLaneName); // Sử dụng showAlert với thông tin của lane
                playSound();
                isCountdownFinished = true;
            }

            countdownDisplays[index].textContent = timeLeft;
            timeLeft--;

            countdownIntervals[index] = setTimeout(update, 1000);
        }

        update();
        startButtons[index].style.display = 'none';
        resetButtons[index].style.display = 'inline';
        countdownDisplays[index].style.display = 'inline';
    }

    function resetCountdown(index) {
        clearTimeout(countdownIntervals[index]);
        countdownDisplays[index].textContent = '0';
        startButtons[index].style.display = 'inline';
        resetButtons[index].style.display = 'none';
        countdownDisplays[index].style.display = 'none';
    }

    // Add change event listeners to all image-select elements
    imageSelects.forEach((imageSelect, index) => {
        imageSelect.addEventListener('change', function () {
            const selectedValue = this.value;

            // Log the selected value and corresponding timeLeft
            console.log('Selected Value:', selectedValue);
            console.log('Time Left:', valueToTimeLeft[selectedValue]);

            // Change the src of the selected-image
            const selectedImage = this.parentElement.querySelector('.selected-image');
            selectedImage.src = selectedValue;

            // Update countdown-display content
            countdownDisplays[index].textContent = valueToTimeLeft[selectedValue];
        });
    });

    // Add click event listeners to all start-button elements
    startButtons.forEach((startButton, index) => {
        startButton.addEventListener('click', function () {
            startCountdown(index);
        });
    });

    // Add click event listeners to all reset-button elements
    resetButtons.forEach((resetButton, index) => {
        resetButton.addEventListener('click', function () {
            resetCountdown(index);
        });
    });

});