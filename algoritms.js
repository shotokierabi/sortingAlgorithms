const arrayContainer = document.getElementById('arrayContainer');
const generateArrayButton = document.getElementById('generateArray');
const executeAlgorithmButton = document.getElementById('executeAlgorithm');
const algorithmSelect = document.getElementById('algorithmSelect');
const executionTimeDisplay = document.getElementById('executionTime');

let array = [];

// Генерация случайного массива
function generateArray() {
    array = [];
    arrayContainer.innerHTML = ''; // Очищаем контейнер
    for (let i = 0; i < 25; i++) {  // Ограничиваем количество столбцов до 25
        const value = Math.floor(Math.random() * 1000) + 1; // Генерация числа от 1 до 1000
        array.push(value);

        const bar = document.createElement('div');
        bar.classList.add('array-bar');
        bar.style.height = `${value * 0.3}px`; // Пропорциональная высота для столбцов
        const valueLabel = document.createElement('div');
        valueLabel.classList.add('value');
        valueLabel.innerText = value;
        bar.appendChild(valueLabel);
        arrayContainer.appendChild(bar);
    }
}

// Пауза для визуализации
function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Визуализация массива
function updateBars(activeIndices = []) {
    const bars = document.querySelectorAll('.array-bar');
    bars.forEach((bar, index) => {
        bar.style.height = `${array[index] * 0.3}px`; // Обновляем высоту
        const valueLabel = bar.querySelector('.value');
        valueLabel.innerText = array[index]; // Обновляем значение над столбцом
        if (activeIndices.includes(index)) {
            bar.style.backgroundColor = 'red'; // Выделяем активный столбец
        } else {
            bar.style.backgroundColor = '#4CAF50'; // Обычный цвет
        }
    });
}

// Простые алгоритмы

// Сортировка пузырьком
async function bubbleSort() {
    for (let i = 0; i < array.length - 1; i++) {
        for (let j = 0; j < array.length - i - 1; j++) {
            updateBars([j, j + 1]);
            if (array[j] > array[j + 1]) {
                [array[j], array[j + 1]] = [array[j + 1], array[j]];
                updateBars([j, j + 1]);
                await sleep(100);
            }
        }
    }
    updateBars();
}

// Сортировка вставками
async function insertionSort() {
    for (let i = 1; i < array.length; i++) {
        let j = i;
        while (j > 0 && array[j - 1] > array[j]) {
            updateBars([j, j - 1]);
            [array[j], array[j - 1]] = [array[j - 1], array[j]];
            updateBars([j, j - 1]);
            await sleep(100);
            j--;
        }
    }
    updateBars();
}

// Сложные алгоритмы

// Быстрая сортировка
async function quickSort(left = 0, right = array.length - 1) {
    if (left >= right) return;

    const pivot = array[right];
    let partitionIndex = left;

    for (let i = left; i < right; i++) {
        updateBars([i, partitionIndex, right]);
        if (array[i] < pivot) {
            [array[i], array[partitionIndex]] = [array[partitionIndex], array[i]];
            partitionIndex++;
            updateBars([i, partitionIndex]);
            await sleep(100);
        }
    }

    [array[partitionIndex], array[right]] = [array[right], array[partitionIndex]];
    updateBars([partitionIndex, right]);
    await sleep(100);

    await quickSort(left, partitionIndex - 1);
    await quickSort(partitionIndex + 1, right);
    updateBars();
}

// Сортировка слиянием
async function mergeSort(start = 0, end = array.length - 1) {
    if (start >= end) return;

    const mid = Math.floor((start + end) / 2);
    await mergeSort(start, mid);
    await mergeSort(mid + 1, end);

    const mergedArray = [];
    let left = start, right = mid + 1;

    while (left <= mid && right <= end) {
        if (array[left] <= array[right]) {
            mergedArray.push(array[left++]);
        } else {
            mergedArray.push(array[right++]);
        }
    }

    while (left <= mid) mergedArray.push(array[left++]);
    while (right <= end) mergedArray.push(array[right++]);


    for (let i = start; i <= end; i++) {
        array[i] = mergedArray[i - start];
        updateBars([i]);
        await sleep(100);
    }
}

// Измерение времени выполнения
async function measureTime(callback) {
    const startTime = performance.now();
    await callback();
    const endTime = performance.now();
    executionTimeDisplay.textContent = `${(endTime - startTime).toFixed(2)} мс`;
}

// Выбор алгоритма
async function executeAlgorithm() {
    const selectedAlgorithm = algorithmSelect.value;

    switch (selectedAlgorithm) {
        case 'bubble':
            await measureTime(bubbleSort);
            break;
        case 'insertion':
            await measureTime(insertionSort);
            break;
        case 'quick':
            await measureTime(() => quickSort());
            break;
        case 'merge':
            await measureTime(() => mergeSort());
            break;
        default:
            alert('Алгоритм не реализован');
    }
}

// События
generateArrayButton.addEventListener('click', generateArray);
executeAlgorithmButton.addEventListener('click', executeAlgorithm);

// Инициализация массива
generateArray();
