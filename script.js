document.getElementById("file").addEventListener("change", handleFile);

let originalText = ""; // Original text loaded from the file

async function handleFile(event) {
    const file = event.target.files[0];
    if (file.name.endsWith(".docx")) {
        const reader = new FileReader();
        reader.onload = function (e) {
            mammoth.extractRawText({ arrayBuffer: e.target.result })
                .then(function (result) {
                    originalText = result.value.trim();
                    document.getElementById("originalData").innerText = originalText;
                })
                .catch(function (err) {
                    console.error("Error reading DOCX file:", err);
                });
        };
        reader.readAsArrayBuffer(file);
    } else {
        const reader = new FileReader();
        reader.onload = function () {
            originalText = reader.result.trim();
            document.getElementById("originalData").innerText = originalText;
        };
        reader.readAsText(file);
    }
}

function sortData(algorithm) {
    const caseSensitive = document.getElementById("caseSensitive").checked;
    let text = originalText.split(/\s+/);

    // If the case-sensitive flag is checked, convert words to lowercase for sorting
    const sortableText = caseSensitive ? text.map(word => word.toLowerCase()) : [...text];

    let startTime = performance.now();
    let sortedText;
    switch (algorithm) {
        case "bubble":
            sortedText = bubbleSort(sortableText);
            updateTime("bubble", performance.now() - startTime);
            break;
        case "selection":
            sortedText = selectionSort(sortableText);
            updateTime("selection", performance.now() - startTime);
            break;
        case "insertion":
            sortedText = insertionSort(sortableText);
            updateTime("insertion", performance.now() - startTime);
            break;
        case "quick":
            sortedText = quickSort(sortableText);
            updateTime("quick", performance.now() - startTime);
            break;
        case "merge":
            sortedText = mergeSort(sortableText);
            updateTime("merge", performance.now() - startTime);
            break;
        case "heap":
            sortedText = heapSort(sortableText);
            updateTime("heap", performance.now() - startTime);
            break;
        default:
            console.error("Unknown algorithm:", algorithm);
    }

    // Display sorted data
    document.getElementById("sortedData").innerText = sortedText.join(" ");
}

function updateTime(algorithm, time) {
    const timeCell = document.getElementById(`time-${algorithm}`);
    if (timeCell) {
        timeCell.innerText = `${time.toFixed(2)} ms`;
    } else {
        console.error(`Time cell for ${algorithm} not found.`);
    }
}

// Bubble Sort
function bubbleSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n - 1; i++) {
        for (let j = 0; j < n - i - 1; j++) {
            if (arr[j] > arr[j + 1]) {
                [arr[j], arr[j + 1]] = [arr[j + 1], arr[j]];
            }
        }
    }
    return arr;
}

// Selection Sort
function selectionSort(arr) {
    const n = arr.length;
    for (let i = 0; i < n; i++) {
        let minIdx = i;
        for (let j = i + 1; j < n; j++) {
            if (arr[j] < arr[minIdx]) {
                minIdx = j;
            }
        }
        [arr[i], arr[minIdx]] = [arr[minIdx], arr[i]];
    }
    return arr;
}

// Insertion Sort
function insertionSort(arr) {
    const n = arr.length;
    for (let i = 1; i < n; i++) {
        let key = arr[i];
        let j = i - 1;
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j];
            j--;
        }
        arr[j + 1] = key;
    }
    return arr;
}

// Quick Sort
function quickSort(arr) {
    if (arr.length <= 1) return arr;
    const pivot = arr[arr.length - 1];
    const left = [];
    const right = [];
    for (let i = 0; i < arr.length - 1; i++) {
        if (arr[i] < pivot) {
            left.push(arr[i]);
        } else {
            right.push(arr[i]);
        }
    }
    return [...quickSort(left), pivot, ...quickSort(right)];
}

// Merge Sort
function mergeSort(arr) {
    if (arr.length <= 1) return arr;

    const mid = Math.floor(arr.length / 2);
    const left = mergeSort(arr.slice(0, mid));
    const right = mergeSort(arr.slice(mid));

    return merge(left, right);
}

function merge(left, right) {
    const result = [];
    let i = 0, j = 0;
    while (i < left.length && j < right.length) {
        if (left[i] < right[j]) {
            result.push(left[i]);
            i++;
        } else {
            result.push(right[j]);
            j++;
        }
    }
    return [...result, ...left.slice(i), ...right.slice(j)];
}

// Heap Sort
function heapSort(arr) {
    const n = arr.length;

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
        heapify(arr, n, i);
    }

    // Extract elements from heap
    for (let i = n - 1; i > 0; i--) {
        [arr[0], arr[i]] = [arr[i], arr[0]];
        heapify(arr, i, 0);
    }

    return arr;
}

function heapify(arr, n, i) {
    let largest = i;
    const left = 2 * i + 1;
    const right = 2 * i + 2;

    if (left < n && arr[left] > arr[largest]) {
        largest = left;
    }

    if (right < n && arr[right] > arr[largest]) {
        largest = right;
    }

    if (largest !== i) {
        [arr[i], arr[largest]] = [arr[largest], arr[i]];
        heapify(arr, n, largest);
    }
}
