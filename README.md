# Shopping List Sorter - Web Application

A modern web-based shopping list organizer that automatically sorts items by predefined sections, built with vanilla JavaScript, HTML, and CSS.

## Features

### 🛒 Core Functionality
- **Smart Sorting**: Automatically organizes shopping items by store sections
- **Fuzzy Matching**: Suggests similar items when unknown items are entered
- **Section Management**: Add, rename, and delete shopping sections
- **Persistent Storage**: Saves your items and sections using browser localStorage
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile devices

### 🎨 Modern UI/UX
- **Beautiful Design**: Clean, modern interface with gradient backgrounds
- **Modal Dialogs**: Intuitive popup interfaces for section management
- **Real-time Feedback**: Success/error messages and loading states
- **Keyboard Shortcuts**: Use Ctrl+Enter to sort items quickly

## How to Use

### Getting Started
1. Open `index.html` in any modern web browser
2. The app will load with sample data (if debug mode is enabled)
3. Start adding your shopping items to the left text area

### Sorting Items
1. Enter your shopping items in the left text area (one item per line)
2. Click the **"Sort Items"** button or press **Ctrl+Enter**
3. Items will be automatically sorted by section in the right text area

### Managing Sections
1. Click the **"Manage Sections"** button
2. **Add New Section**: Enter a section name and click "Add Section"
3. **Rename Section**: Click "Rename" next to any section
4. **Delete Section**: Click "Delete" to remove a section (items in that section will also be removed)

### Unknown Items
When you enter an item that's not in the database:
1. The app will first check for similar items and suggest them
2. If no similar item is found, you'll be prompted to create a new section
3. The item will be saved for future use

## Default Sections
The app comes with 20 predefined sections:
- Fruit and Veg
- Cheese
- Deli
- Bread
- Bakery
- Seafood
- Health
- Household
- Cereal
- Spreads
- Meat
- Cookies
- Snacks
- Drinks
- Frozen Meat
- Milk
- Baking
- Sauces
- Dairy
- Ice Cream

## Default Items
The app includes common grocery items pre-categorized:
- **Fruit and Veg**: broccoli, cauliflower
- **Deli**: smoked meat
- **Bread**: bagels
- **Bakery**: eclair
- **Seafood**: salmon
- **Health**: vitamin d
- **Household**: ziplock bags
- **Cereal**: froot loops, oats
- **Meat**: ground beef
- **Cookies**: oreos
- **Snacks**: chips
- **Drinks**: coke
- **Frozen Meat**: fish sticks
- **Milk**: milk
- **Baking**: flour
- **Sauces**: pickles
- **Dairy**: greek yogurt
- **Ice Cream**: drumsticks

## Technical Details

### Browser Compatibility
- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

### Data Storage
- Uses browser localStorage for persistence
- No server required - everything runs locally
- Data is automatically saved when you make changes

### Performance
- Fast fuzzy matching using Levenshtein distance algorithm
- Efficient sorting with Map data structures
- Responsive UI with CSS Grid and Flexbox

## File Structure
```
web/
├── index.html          # Main HTML file
├── styles.css          # CSS styles and responsive design
├── script.js           # JavaScript application logic
└── README.md           # This file
```

## Keyboard Shortcuts
- **Ctrl+Enter**: Sort items
- **Escape**: Close modal dialogs

## Tips for Best Results
1. **Be Consistent**: Use the same spelling for items (e.g., "yogurt" vs "yoghurt")
2. **Add Common Items**: Use the section manager to add items you frequently buy
3. **Use Clear Section Names**: Keep section names simple and descriptive
4. **Regular Maintenance**: Periodically review and clean up your sections

## Troubleshooting

### Items Not Sorting Correctly
- Check if the item exists in your database
- Try adding the item through the section manager
- Ensure consistent spelling

### Data Not Saving
- Check if localStorage is enabled in your browser
- Try refreshing the page
- Clear browser cache if needed

### Modal Dialogs Not Working
- Ensure JavaScript is enabled
- Try refreshing the page
- Check browser console for errors

## Development

This web application is a direct translation of a Java Swing application, maintaining all the original functionality while providing a modern web interface. The core algorithms (fuzzy matching, sorting, section management) have been faithfully reimplemented in JavaScript.

## License

This project is open source and available under the MIT License. 