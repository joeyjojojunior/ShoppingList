// Shopping List Sorter Web Application
class ShoppingListSorter {
    constructor() {
        this.itemsMap = new Map();
        this.sectionsList = [];
        this.sectionsMap = new Map();
        this.debug = false;
        this.isReorderMode = false;
        
        this.initializeData();
        this.setupEventListeners();
        this.loadData();
        
        if (this.debug) {
            this.loadDebugData();
        }
    }

    // Initialize data structures
    initializeData() {
        // Default sections (same as Java version)
        this.sectionsList = [
            'fruit and veg', 'cheese', 'deli', 'bread', 'bakery', 'seafood', 
            'health', 'household', 'cereal', 'spreads', 'meat', 'cookies', 
            'snacks', 'drinks', 'frozen meat', 'milk', 'baking', 'sauces', 
            'dairy', 'ice cream'
        ];
        
        // Default items (same as Java version) - stored in lowercase
        const defaultItems = {
            'broccoli': 'fruit and veg',
            'cauliflower': 'fruit and veg',
            'smoked meat': 'deli',
            'bagels': 'bread',
            'eclair': 'bakery',
            'salmon': 'seafood',
            'vitamin d': 'health',
            'ziplock bags': 'household',
            'froot loops': 'cereal',
            'oats': 'cereal',
            'ground beef': 'meat',
            'oreos': 'cookies',
            'chips': 'snacks',
            'coke': 'drinks',
            'fish sticks': 'frozen meat',
            'milk': 'milk',
            'flour': 'baking',
            'pickles': 'sauces',
            'greek yogurt': 'dairy',
            'drumsticks': 'ice cream'
        };
        
        this.itemsMap = new Map(Object.entries(defaultItems));
        this.buildSectionsMap();
    }

    // Build sections map for sorting
    buildSectionsMap() {
        this.sectionsMap.clear();
        this.sectionsList.forEach((section, index) => {
            this.sectionsMap.set(section, index);
        });
    }

    // Setup event listeners
    setupEventListeners() {
        // Main buttons
        document.getElementById('sort-btn').addEventListener('click', () => {
            this.onSortButtonPressed();
        });
        
        document.getElementById('sections-btn').addEventListener('click', () => {
            this.onSectionsButtonPressed();
        });
        
        document.getElementById('clear-btn').addEventListener('click', () => {
            this.clearAll();
        });

        // Export and import functionality
        document.getElementById('export-btn').addEventListener('click', () => {
            this.exportData();
        });

        document.getElementById('import-btn').addEventListener('click', () => {
            this.importData();
        });

        document.getElementById('import-file-input').addEventListener('change', (e) => {
            this.handleImportFile(e);
        });

        // Auto-resize textareas
        this.setupTextareaAutoResize();

        // Modal close buttons
        document.querySelectorAll('.close').forEach(closeBtn => {
            closeBtn.addEventListener('click', (e) => {
                this.closeModal(e.target.closest('.modal'));
            });
        });

        // Modal backdrop clicks
        document.querySelectorAll('.modal').forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    this.closeModal(modal);
                }
            });
        });

        // Section management
        document.getElementById('add-section-btn').addEventListener('click', () => {
            this.addSection();
        });

        // Items management
        document.getElementById('items-btn').addEventListener('click', () => {
            this.showItemsManagementDialog();
        });

        document.getElementById('add-item-btn').addEventListener('click', () => {
            this.showAddItemDialog();
        });

        document.getElementById('confirm-add-item-btn').addEventListener('click', () => {
            this.addNewItem();
        });

        document.getElementById('cancel-add-item-btn').addEventListener('click', () => {
            this.closeModal(document.getElementById('add-item-modal'));
        });

        document.getElementById('save-item-btn').addEventListener('click', () => {
            this.saveItemChanges();
        });

        document.getElementById('delete-item-btn').addEventListener('click', () => {
            this.deleteCurrentItem();
        });

        document.getElementById('cancel-edit-btn').addEventListener('click', () => {
            this.closeModal(document.getElementById('edit-item-modal'));
        });

        // Search and filter functionality
        document.getElementById('item-search').addEventListener('input', () => {
            this.filterItems();
        });

        document.getElementById('section-filter').addEventListener('change', () => {
            this.filterItems();
        });

        // Reorder sections
        document.getElementById('reorder-sections-btn').addEventListener('click', () => {
            this.toggleReorderMode();
        });

        document.getElementById('save-reorder-btn').addEventListener('click', () => {
            this.saveReorder();
        });

        document.getElementById('exit-reorder-btn').addEventListener('click', () => {
            this.cancelReorder();
        });

        // Similar item modal
        document.getElementById('yes-btn').addEventListener('click', () => {
            this.handleSimilarItemResponse(true);
        });
        
        document.getElementById('no-btn').addEventListener('click', () => {
            this.handleSimilarItemResponse(false);
        });

        // New section modal
        document.getElementById('create-section-btn').addEventListener('click', () => {
            this.createNewSection();
        });
        
        document.getElementById('cancel-section-btn').addEventListener('click', () => {
            this.handleSectionCancel();
        });

        // Handle double-click on existing sections
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('section-option') && !e.target.classList.contains('create-new')) {
                // Remove previous selection
                document.querySelectorAll('.section-option').forEach(opt => {
                    opt.classList.remove('selected');
                });
                // Select this section
                e.target.classList.add('selected');
                // Auto-confirm selection after a short delay
                setTimeout(() => {
                    this.handleExistingSectionSelection();
                }, 300);
            }
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === 'Enter') {
                this.onSortButtonPressed();
            }
        });
    }

    // Setup textarea auto-resize functionality
    setupTextareaAutoResize() {
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        
        // Function to resize textarea
        const resizeTextarea = (textarea) => {
            textarea.style.height = 'auto';
            const scrollHeight = textarea.scrollHeight;
            const maxHeight = window.innerHeight * 0.7; // 70vh
            const newHeight = Math.min(scrollHeight, maxHeight);
            textarea.style.height = newHeight + 'px';
        };
        
        // Function to sync output area height with input area
        const syncOutputHeight = () => {
            const inputHeight = inputArea.offsetHeight;
            outputArea.style.height = inputHeight + 'px';
        };
        
        // Initial resize
        resizeTextarea(inputArea);
        syncOutputHeight();
        
        // Resize on input
        inputArea.addEventListener('input', () => {
            resizeTextarea(inputArea);
            syncOutputHeight();
        });
        
        // Resize on window resize
        window.addEventListener('resize', () => {
            resizeTextarea(inputArea);
            syncOutputHeight();
        });
    }

    // Load data from localStorage
    loadData() {
        try {
            const savedItems = localStorage.getItem('shoppingListItems');
            const savedSections = localStorage.getItem('shoppingListSections');
            
            if (savedItems) {
                this.itemsMap = new Map(JSON.parse(savedItems));
            }
            
            if (savedSections) {
                this.sectionsList = JSON.parse(savedSections);
                this.buildSectionsMap();
            }
        } catch (error) {
            console.error('Error loading data:', error);
        }
    }

    // Save data to localStorage
    saveData() {
        try {
            localStorage.setItem('shoppingListItems', JSON.stringify(Array.from(this.itemsMap.entries())));
            localStorage.setItem('shoppingListSections', JSON.stringify(this.sectionsList));
        } catch (error) {
            console.error('Error saving data:', error);
        }
    }

    // Load debug data
    loadDebugData() {
        const debugList = [
            'broccoli', 'cauliflower', 'greek yogurt', 'froot loops', 'bagels',
            'milk', 'coke', 'oats', 'salmon', 'smoked meat', 'pickles',
            'ziplock bags', 'eclair', 'ground beef', 'fish sticks', 'vitamin d',
            'drumsticks', 'oreos', 'beets', 'whipping cream'
        ];
        this.updateTextArea1(debugList.join('\n'));
    }

    // Get text from input area
    getTextArea1Content() {
        return document.getElementById('input-area').value;
    }

    // Update input area
    updateTextArea1(text) {
        const textarea = document.getElementById('input-area');
        textarea.value = text;
        this.resizeTextarea(textarea);
        this.syncOutputHeight();
    }

    // Update output area
    updateTextArea2(text) {
        const textarea = document.getElementById('output-area');
        textarea.value = text;
        this.syncOutputHeight();
    }

    // Resize textarea helper method
    resizeTextarea(textarea) {
        textarea.style.height = 'auto';
        const scrollHeight = textarea.scrollHeight;
        const maxHeight = window.innerHeight * 0.7; // 70vh
        const newHeight = Math.min(scrollHeight, maxHeight);
        textarea.style.height = newHeight + 'px';
    }

    // Sync output height with input height
    syncOutputHeight() {
        const inputArea = document.getElementById('input-area');
        const outputArea = document.getElementById('output-area');
        const inputHeight = inputArea.offsetHeight;
        outputArea.style.height = inputHeight + 'px';
    }

    // Convert string to array list
    arrayListFromString(string) {
        if (!string || string.trim() === '') {
            return [];
        }
        return string.split('\n')
            .map(line => line.trim())
            .filter(line => line.length > 0);
    }

    // Convert array list to string
    arrayListToString(list) {
        return list.join('\n');
    }

    // Convert map keys to string
    mapKeysToString(map) {
        return Array.from(map.keys()).join('\n');
    }

    // Sort button pressed
    async onSortButtonPressed() {
        const textArea1Content = this.getTextArea1Content();
        const shoppingList = this.arrayListFromString(textArea1Content);
        
        if (shoppingList.length === 0) {
            this.showMessage('Please enter some items to sort.', 'info');
            return;
        }

        // Process unknown items
        const processedList = await this.processUnknownItems(shoppingList);
        
        // Build and sort shopping list
        const shoppingListMap = this.buildShoppingListMap(processedList);
        const sortedShoppingListMap = this.buildSortedShoppingListMap(shoppingListMap);
        
        this.updateTextArea2(this.mapKeysToString(sortedShoppingListMap));
        this.updateTextArea1(this.arrayListToString(processedList));
    }

    // Build shopping list map
    buildShoppingListMap(shoppingList) {
        const shoppingListMap = new Map();
        
        for (const item of shoppingList) {
            const itemLower = item.toLowerCase();
            const section = this.itemsMap.get(itemLower);
            let priority;
            
            if (section && this.sectionsMap.has(section)) {
                priority = this.sectionsMap.get(section);
            } else {
                priority = Number.MAX_SAFE_INTEGER;
            }
            
            shoppingListMap.set(item, priority);
        }
        
        return shoppingListMap;
    }

    // Build sorted shopping list map
    buildSortedShoppingListMap(shoppingListMap) {
        return new Map([...shoppingListMap.entries()].sort((a, b) => a[1] - b[1]));
    }

    // Process unknown items
    async processUnknownItems(shoppingList) {
        const processedList = [...shoppingList];
        
        for (let i = 0; i < processedList.length; i++) {
            const item = processedList[i];
            const itemLower = item.toLowerCase();
            
            if (!this.itemsMap.has(itemLower)) {
                // Check for similar items
                const similarItem = this.findSimilarItem(itemLower);
                
                if (similarItem) {
                    const useSimilar = await this.showSimilarItemDialog(item, similarItem);
                    if (useSimilar) {
                        processedList[i] = similarItem;
                        continue;
                    }
                }
                
                // Prompt for section
                const selectedSection = await this.promptForSection(item);
                if (selectedSection) {
                    // User selected a section, add item to database (store in lowercase)
                    this.itemsMap.set(itemLower, selectedSection);
                    this.saveData();
                }
                // If selectedSection is null, user canceled - skip adding to database but continue with sort
            }
        }
        
        return processedList;
    }

    // Find similar item using fuzzy matching
    findSimilarItem(targetItem) {
        let bestMatch = null;
        let bestSimilarity = 0.7; // Minimum similarity threshold
        
        for (const [item] of this.itemsMap) {
            const similarity = this.calculateSimilarity(targetItem, item);
            if (similarity > bestSimilarity) {
                bestSimilarity = similarity;
                bestMatch = item;
            }
        }
        
        return bestMatch;
    }

    // Calculate similarity between two strings
    calculateSimilarity(str1, str2) {
        const distance = this.levenshteinDistance(str1, str2);
        const maxLength = Math.max(str1.length, str2.length);
        return 1 - (distance / maxLength);
    }

    // Levenshtein distance calculation
    levenshteinDistance(str1, str2) {
        const matrix = [];
        
        for (let i = 0; i <= str2.length; i++) {
            matrix[i] = [i];
        }
        
        for (let j = 0; j <= str1.length; j++) {
            matrix[0][j] = j;
        }
        
        for (let i = 1; i <= str2.length; i++) {
            for (let j = 1; j <= str1.length; j++) {
                if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
                    matrix[i][j] = matrix[i - 1][j - 1];
                } else {
                    matrix[i][j] = Math.min(
                        matrix[i - 1][j - 1] + 1,
                        matrix[i][j - 1] + 1,
                        matrix[i - 1][j] + 1
                    );
                }
            }
        }
        
        return matrix[str2.length][str1.length];
    }

    // Show similar item dialog
    showSimilarItemDialog(originalItem, similarItem) {
        return new Promise((resolve) => {
            const modal = document.getElementById('similar-modal');
            const message = document.getElementById('similar-message');
            
            message.textContent = `Item '${originalItem}' not found.\n\nDid you mean '${similarItem}'?`;
            
            this.currentSimilarItemCallback = resolve;
            this.showModal(modal);
        });
    }

    // Handle similar item response
    handleSimilarItemResponse(useSimilar) {
        this.closeModal(document.getElementById('similar-modal'));
        if (this.currentSimilarItemCallback) {
            this.currentSimilarItemCallback(useSimilar);
            this.currentSimilarItemCallback = null;
        }
    }

    // Prompt for section
    async promptForSection(item) {
        return new Promise((resolve) => {
            const modal = document.getElementById('new-section-modal');
            const promptText = document.getElementById('section-prompt-text');
            const sectionsList = document.getElementById('existing-sections-list');
            const newSectionInput = document.getElementById('new-section-name');
            
            // Update prompt text
            promptText.textContent = `Select a section for: ${item}`;
            
            // Populate existing sections list
            sectionsList.innerHTML = '';
            this.sectionsList.forEach(section => {
                const sectionDiv = document.createElement('div');
                sectionDiv.className = 'section-option';
                sectionDiv.textContent = section;
                sectionDiv.addEventListener('click', () => {
                    // Remove previous selection
                    sectionsList.querySelectorAll('.section-option').forEach(opt => {
                        opt.classList.remove('selected');
                    });
                    // Select this section
                    sectionDiv.classList.add('selected');
                });
                sectionsList.appendChild(sectionDiv);
            });
            
            // Clear input
            newSectionInput.value = '';
            
            // Resize sections list
            this.resizeSectionsList();
            
            this.currentSectionCallback = resolve;
            this.showModal(modal);
        });
    }

    // Create new section
    createNewSection() {
        const input = document.getElementById('new-section-name');
        const sectionName = input.value.trim().toLowerCase();
        
        if (sectionName) {
            if (!this.sectionsList.includes(sectionName)) {
                this.sectionsList.unshift(sectionName);
                this.buildSectionsMap();
                this.saveData();
            }
            
            this.closeModal(document.getElementById('new-section-modal'));
            if (this.currentSectionCallback) {
                this.currentSectionCallback(sectionName);
                this.currentSectionCallback = null;
            }
        }
    }

    // Handle section selection from existing sections
    handleExistingSectionSelection() {
        const selectedSection = document.querySelector('.section-option.selected');
        if (selectedSection) {
            const sectionName = selectedSection.textContent.toLowerCase();
            this.closeModal(document.getElementById('new-section-modal'));
            if (this.currentSectionCallback) {
                this.currentSectionCallback(sectionName);
                this.currentSectionCallback = null;
            }
        }
    }

    // Handle cancel for section selection
    handleSectionCancel() {
        this.closeModal(document.getElementById('new-section-modal'));
        if (this.currentSectionCallback) {
            this.currentSectionCallback(null); // null means cancel/skip
            this.currentSectionCallback = null;
        }
    }

    // Sections button pressed
    onSectionsButtonPressed() {
        this.showSectionManagementDialog();
    }

    // Show section management dialog
    showSectionManagementDialog() {
        this.populateSectionsModal();
        this.showModal(document.getElementById('sections-modal'));
    }

    // Populate sections modal
    populateSectionsModal() {
        const sectionsContainer = document.getElementById('sections-container');
        const itemsContainer = document.getElementById('items-container');
        
        // Populate sections
        sectionsContainer.innerHTML = '';
        this.sectionsList.forEach((section, index) => {
            const sectionDiv = document.createElement('div');
            sectionDiv.className = 'section-item';
            sectionDiv.draggable = this.isReorderMode;
            
            if (this.isReorderMode) {
                sectionDiv.innerHTML = `
                    <span class="drag-handle">⋮⋮</span>
                    <span class="section-name">${section}</span>
                `;
            } else {
                sectionDiv.innerHTML = `
                    <span class="section-name">${section}</span>
                    <div class="section-actions">
                        <button class="btn btn-small btn-secondary" onclick="app.renameSection('${section}')">Rename</button>
                        <button class="btn btn-small btn-danger" onclick="app.deleteSection('${section}')">Delete</button>
                    </div>
                `;
            }
            
            sectionsContainer.appendChild(sectionDiv);
        });
        
        // Populate items by section in the same order as sections list
        itemsContainer.innerHTML = '';
        const itemsBySection = this.groupItemsBySection();
        
        // Display sections in the same order as the sections list
        this.sectionsList.forEach(section => {
            const items = itemsBySection.get(section) || [];
            if (items.length > 0) {
                const itemDiv = document.createElement('div');
                itemDiv.className = 'item-group';
                itemDiv.innerHTML = `
                    <div>
                        <span class="section-name">${section}</span>
                        <ul class="item-list">
                            ${items.map(item => `<li>${item}</li>`).join('')}
                        </ul>
                    </div>
                `;
                itemsContainer.appendChild(itemDiv);
            }
        });
        
        // Auto-resize sections list in modal
        this.resizeSectionsList();
    }

    // Resize sections list based on content
    resizeSectionsList() {
        const sectionsList = document.getElementById('existing-sections-list');
        if (sectionsList) {
            const sectionCount = this.sectionsList.length;
            const sectionHeight = 48; // Approximate height per section option
            const totalHeight = sectionCount * sectionHeight;
            const maxHeight = window.innerHeight * 0.4; // 40vh
            const newHeight = Math.min(totalHeight, maxHeight);
            sectionsList.style.height = newHeight + 'px';
        }
    }

    // Group items by section
    groupItemsBySection() {
        const groups = new Map();
        
        for (const [item, section] of this.itemsMap) {
            if (!groups.has(section)) {
                groups.set(section, []);
            }
            groups.get(section).push(item);
        }
        
        return groups;
    }

    // Add section
    addSection() {
        const input = document.getElementById('new-section-input');
        const sectionName = input.value.trim().toLowerCase();
        
        if (sectionName && !this.sectionsList.includes(sectionName)) {
            this.sectionsList.unshift(sectionName);
            this.buildSectionsMap();
            this.saveData();
            this.populateSectionsModal();
            input.value = '';
            this.showMessage(`Section '${sectionName}' added successfully!`, 'success');
        } else if (this.sectionsList.includes(sectionName)) {
            this.showMessage(`Section '${sectionName}' already exists.`, 'error');
        }
    }

    // Delete section
    deleteSection(sectionName) {
        const sectionNameLower = sectionName.toLowerCase();
        if (confirm(`Are you sure you want to delete the section '${sectionName}'?`)) {
            // Remove section from list
            this.sectionsList = this.sectionsList.filter(s => s !== sectionNameLower);
            this.buildSectionsMap();
            
            // Remove items from this section
            for (const [item, section] of this.itemsMap) {
                if (section === sectionNameLower) {
                    this.itemsMap.delete(item);
                }
            }
            
            this.saveData();
            this.populateSectionsModal();
            this.showMessage(`Section '${sectionName}' deleted successfully!`, 'success');
        }
    }

    // Rename section
    renameSection(oldSectionName) {
        const oldSectionNameLower = oldSectionName.toLowerCase();
        const newSectionName = prompt(`Enter new name for '${oldSectionName}':`, oldSectionName);
        
        if (newSectionName && newSectionName.trim() && newSectionName !== oldSectionName) {
            const trimmedName = newSectionName.trim().toLowerCase();
            
            if (this.sectionsList.includes(trimmedName)) {
                this.showMessage(`Section '${trimmedName}' already exists.`, 'error');
                return;
            }
            
            // Update section list
            const index = this.sectionsList.indexOf(oldSectionNameLower);
            this.sectionsList[index] = trimmedName;
            this.buildSectionsMap();
            
            // Update items map
            for (const [item, section] of this.itemsMap) {
                if (section === oldSectionNameLower) {
                    this.itemsMap.set(item, trimmedName);
                }
            }
            
            this.saveData();
            this.populateSectionsModal();
            this.showMessage(`Section renamed from '${oldSectionName}' to '${trimmedName}'!`, 'success');
        }
    }

    // Reorder functionality
    toggleReorderMode() {
        const reorderBtn = document.getElementById('reorder-sections-btn');
        const reorderControls = document.getElementById('reorder-controls');
        const sectionsContainer = document.getElementById('sections-container');
        
        if (this.isReorderMode) {
            // Exit reorder mode
            this.isReorderMode = false;
            reorderBtn.style.display = 'inline-block';
            reorderBtn.textContent = 'Reorder Sections';
            reorderBtn.classList.remove('btn-primary');
            reorderBtn.classList.add('btn-outline');
            reorderControls.classList.remove('show');
            sectionsContainer.classList.remove('reorder-mode');
            this.removeDragListeners();
        } else {
            // Enter reorder mode
            this.isReorderMode = true;
            reorderBtn.style.display = 'none';
            reorderControls.classList.add('show');
            sectionsContainer.classList.add('reorder-mode');
            this.setupDragListeners();
        }
        
        this.populateSectionsModal();
    }

    setupDragListeners() {
        const sectionsContainer = document.getElementById('sections-container');
        
        sectionsContainer.addEventListener('dragstart', (e) => {
            if (e.target.classList.contains('section-item')) {
                e.target.classList.add('dragging');
                e.dataTransfer.effectAllowed = 'move';
                e.dataTransfer.setData('text/html', e.target.outerHTML);
            }
        });
        
        sectionsContainer.addEventListener('dragend', (e) => {
            if (e.target.classList.contains('section-item')) {
                e.target.classList.remove('dragging');
            }
        });
        
        sectionsContainer.addEventListener('dragover', (e) => {
            e.preventDefault();
            e.dataTransfer.dropEffect = 'move';
            
            const draggingElement = sectionsContainer.querySelector('.dragging');
            if (!draggingElement) return;
            
            const afterElement = this.getDragAfterElement(sectionsContainer, e.clientY);
            if (afterElement) {
                sectionsContainer.insertBefore(draggingElement, afterElement);
            } else {
                sectionsContainer.appendChild(draggingElement);
            }
        });
        
        sectionsContainer.addEventListener('drop', (e) => {
            e.preventDefault();
        });
    }

    removeDragListeners() {
        const sectionsContainer = document.getElementById('sections-container');
        if (sectionsContainer) {
            sectionsContainer.removeEventListener('dragstart', this.handleDragStart);
            sectionsContainer.removeEventListener('dragend', this.handleDragEnd);
            sectionsContainer.removeEventListener('dragover', this.handleDragOver);
            sectionsContainer.removeEventListener('drop', this.handleDrop);
        }
    }

    getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.section-item:not(.dragging)')];
        
        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    saveReorder() {
        const sectionsContainer = document.getElementById('sections-container');
        const newOrder = [];
        
        sectionsContainer.querySelectorAll('.section-item').forEach(item => {
            const sectionName = item.querySelector('.section-name').textContent.toLowerCase();
            newOrder.push(sectionName);
        });
        
        // Update sections list with new order
        this.sectionsList = newOrder;
        this.buildSectionsMap();
        this.saveData();
        
        // Exit reorder mode
        this.toggleReorderMode();
        
        this.showMessage('Section order saved successfully!', 'success');
    }

    cancelReorder() {
        // Exit reorder mode without saving
        this.toggleReorderMode();
        this.showMessage('Section reordering cancelled.', 'info');
    }

    // Items management functionality
    showItemsManagementDialog() {
        this.populateItemsModal();
        this.showModal(document.getElementById('items-modal'));
    }

    populateItemsModal() {
        const itemsContainer = document.getElementById('items-container-manage');
        const sectionFilter = document.getElementById('section-filter');
        
        // Populate section filter
        sectionFilter.innerHTML = '<option value="">All Sections</option>';
        this.sectionsList.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            sectionFilter.appendChild(option);
        });
        
        // Populate items list
        this.displayItemsList();
    }

    displayItemsList() {
        const itemsContainer = document.getElementById('items-container-manage');
        const searchTerm = document.getElementById('item-search').value.toLowerCase();
        const sectionFilter = document.getElementById('section-filter').value;
        
        itemsContainer.innerHTML = '';
        
        // Convert items map to array and sort alphabetically
        const itemsArray = Array.from(this.itemsMap.entries()).sort((a, b) => a[0].localeCompare(b[0]));
        
        itemsArray.forEach(([itemName, section]) => {
            // Apply filters (case-insensitive search)
            if (searchTerm && !itemName.toLowerCase().includes(searchTerm)) return;
            if (sectionFilter && section !== sectionFilter) return;
            
            const itemDiv = document.createElement('div');
            itemDiv.className = 'item-entry';
            itemDiv.innerHTML = `
                <div class="item-info">
                    <div class="item-name">${itemName}</div>
                    <div class="item-section">Section: ${section}</div>
                </div>
                <div class="item-actions">
                    <button class="btn btn-small btn-secondary" onclick="app.editItem('${itemName}')">Edit</button>
                    <button class="btn btn-small btn-danger" onclick="app.deleteItem('${itemName}')">Delete</button>
                </div>
            `;
            itemsContainer.appendChild(itemDiv);
        });
    }

    filterItems() {
        this.displayItemsList();
    }

    showAddItemDialog() {
        const newItemName = document.getElementById('new-item-name');
        const newItemSection = document.getElementById('new-item-section');
        
        // Clear form
        newItemName.value = '';
        
        // Populate section dropdown
        newItemSection.innerHTML = '';
        this.sectionsList.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            newItemSection.appendChild(option);
        });
        
        this.showModal(document.getElementById('add-item-modal'));
        newItemName.focus();
    }

    addNewItem() {
        const itemName = document.getElementById('new-item-name').value.trim();
        const section = document.getElementById('new-item-section').value;
        
        if (!itemName) {
            this.showMessage('Please enter an item name.', 'error');
            return;
        }
        
        const itemNameLower = itemName.toLowerCase();
        if (this.itemsMap.has(itemNameLower)) {
            this.showMessage(`Item '${itemName}' already exists.`, 'error');
            return;
        }
        
        this.itemsMap.set(itemNameLower, section);
        this.saveData();
        
        this.closeModal(document.getElementById('add-item-modal'));
        this.populateItemsModal();
        this.showMessage(`Item '${itemName}' added successfully!`, 'success');
    }

    editItem(itemName) {
        const currentSection = this.itemsMap.get(itemName);
        
        // Populate edit form
        document.getElementById('edit-item-name').value = itemName;
        
        const editItemSection = document.getElementById('edit-item-section');
        editItemSection.innerHTML = '';
        this.sectionsList.forEach(section => {
            const option = document.createElement('option');
            option.value = section;
            option.textContent = section;
            if (section === currentSection) {
                option.selected = true;
            }
            editItemSection.appendChild(option);
        });
        
        // Store current item for reference (store original case for display)
        this.currentEditingItem = itemName;
        this.currentEditingItemLower = itemName.toLowerCase();
        
        this.showModal(document.getElementById('edit-item-modal'));
    }

    saveItemChanges() {
        const newName = document.getElementById('edit-item-name').value.trim();
        const newSection = document.getElementById('edit-item-section').value;
        const oldName = this.currentEditingItem;
        const oldNameLower = this.currentEditingItemLower;
        
        if (!newName) {
            this.showMessage('Please enter an item name.', 'error');
            return;
        }
        
        const newNameLower = newName.toLowerCase();
        if (newNameLower !== oldNameLower && this.itemsMap.has(newNameLower)) {
            this.showMessage(`Item '${newName}' already exists.`, 'error');
            return;
        }
        
        // Remove old item and add new one
        this.itemsMap.delete(oldNameLower);
        this.itemsMap.set(newNameLower, newSection);
        this.saveData();
        
        this.closeModal(document.getElementById('edit-item-modal'));
        this.populateItemsModal();
        this.showMessage(`Item updated successfully!`, 'success');
    }

    deleteCurrentItem() {
        const itemName = this.currentEditingItem;
        const itemNameLower = this.currentEditingItemLower;
        if (confirm(`Are you sure you want to delete '${itemName}'?`)) {
            this.itemsMap.delete(itemNameLower);
            this.saveData();
            
            this.closeModal(document.getElementById('edit-item-modal'));
            this.populateItemsModal();
            this.showMessage(`Item '${itemName}' deleted successfully!`, 'success');
        }
    }

    deleteItem(itemName) {
        const itemNameLower = itemName.toLowerCase();
        if (confirm(`Are you sure you want to delete '${itemName}'?`)) {
            this.itemsMap.delete(itemNameLower);
            this.saveData();
            
            this.populateItemsModal();
            this.showMessage(`Item '${itemName}' deleted successfully!`, 'success');
        }
    }

    // Clear all
    clearAll() {
        if (confirm('Are you sure you want to clear all text areas?')) {
            this.updateTextArea1('');
            this.updateTextArea2('');
        }
    }

    // Show modal
    showModal(modal) {
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    }

    // Close modal
    closeModal(modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    // Show message
    showMessage(text, type = 'info') {
        // Remove existing messages
        const existingMessages = document.querySelectorAll('.message');
        existingMessages.forEach(msg => msg.remove());
        
        // Create new message
        const message = document.createElement('div');
        message.className = `message ${type}`;
        message.textContent = text;
        
        // Insert at top of main content
        const main = document.querySelector('main');
        main.insertBefore(message, main.firstChild);
        
        // Auto-remove after 5 seconds
        setTimeout(() => {
            if (message.parentNode) {
                message.remove();
            }
        }, 5000);
    }

    // Export data to JSON file
    exportData() {
        try {
            const exportData = {
                items: Array.from(this.itemsMap.entries()),
                sections: this.sectionsList,
                exportDate: new Date().toISOString(),
                version: '1.0'
            };
            
            const dataStr = JSON.stringify(exportData, null, 2);
            const dataBlob = new Blob([dataStr], { type: 'application/json' });
            
            // Create download link
            const url = URL.createObjectURL(dataBlob);
            const link = document.createElement('a');
            link.href = url;
            link.download = `shopping-list-backup-${new Date().toISOString().split('T')[0]}.json`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            URL.revokeObjectURL(url);
            
            this.showMessage('Data exported successfully!', 'success');
        } catch (error) {
            console.error('Error exporting data:', error);
            this.showMessage('Error exporting data. Please try again.', 'error');
        }
    }

    // Import data from file
    importData() {
        document.getElementById('import-file-input').click();
    }

    // Handle imported file
    handleImportFile(event) {
        const file = event.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                const importData = JSON.parse(e.target.result);
                
                // Validate the imported data structure
                if (!importData.items || !importData.sections) {
                    throw new Error('Invalid backup file format');
                }
                
                // Confirm import with user
                const itemCount = importData.items.length;
                const sectionCount = importData.sections.length;
                const confirmMessage = `This will replace your current data with:\n` +
                    `• ${itemCount} items\n` +
                    `• ${sectionCount} sections\n\n` +
                    `Are you sure you want to continue?`;
                
                if (confirm(confirmMessage)) {
                    // Import the data
                    this.itemsMap = new Map(importData.items);
                    this.sectionsList = importData.sections;
                    this.buildSectionsMap();
                    this.saveData();
                    
                    this.showMessage(`Data imported successfully! ${itemCount} items and ${sectionCount} sections loaded.`, 'success');
                }
            } catch (error) {
                console.error('Error importing data:', error);
                this.showMessage('Error importing data. Please check that the file is a valid backup file.', 'error');
            }
        };
        
        reader.readAsText(file);
        
        // Clear the file input for future imports
        event.target.value = '';
    }
}

// Initialize the application
let app;
document.addEventListener('DOMContentLoaded', () => {
    app = new ShoppingListSorter();
});
