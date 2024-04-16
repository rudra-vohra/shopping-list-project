const itemForm = document.getElementById('item-form');
const itemList = document.getElementById('item-list');
const itemInput = document.getElementById('item-input');
const clearBtn = document.getElementById('clear');
const itemFilter = document.getElementById('filter');
const formBtn = itemForm.querySelector('button');
let isEditMode = false;

function displayItems () {
  const itemsFromStorage = getItemsFromStorage();
  itemsFromStorage.forEach(item => {addItemToDOM(item)});
  checkUI();
}

function onAddItemSubmit(e){
  e.preventDefault();
  const newItem = itemInput.value;
  // Validaate the form
  if(newItem === '') {
    alert('Please Enter an Item');
    return;
  }

  // Check for edit mode
  if(isEditMode) {
    const itemToEdit = itemList.querySelector('.edit-mode');
    itemToEdit.classList.remove('edit-mode');
    removeItemFromStorage(itemToEdit.textContent);
    itemToEdit.remove();

    isEditMode = false;
  }else{
    if(checkIfItemExists(newItem)){
      alert('The item already exists in the list');
      return;
    }
  }

  addItemToDOM(newItem);
  addItemToStorage(newItem);

  checkUI();
  itemInput.value = '';
}

function addItemToDOM (item) {
  const li = document.createElement('li');
  li.appendChild(document.createTextNode(item));
  
  const button = createButton('remove-item btn-link text-red');
  
  li.appendChild(button);

  itemList.appendChild(li);
}

function addItemToStorage (item) {
  const itemsFromStorage = getItemsFromStorage();

  // Add new item to Array
  itemsFromStorage.push(item);

  // convert to json string and set to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}

function getItemsFromStorage () {
  let itemsFromStorage;

  if(localStorage.getItem('items') === null){
    itemsFromStorage = [];
  }
  else{
    itemsFromStorage = JSON.parse(localStorage.getItem('items'));
  }

  return itemsFromStorage;
}
function createButton (classes){
  const button = document.createElement('button');
  button.className = classes;
  
  const icon = createIcon('fa-solid fa-xmark');

  button.appendChild(icon);
  return button;
}

function createIcon(classes){
  const icon = document.createElement('i');
  icon.className = classes;
  return icon;
}

function onClickItem (e){
  if(e.target.parentElement.classList.contains('remove-item')){
    removeItem(e.target.parentElement.parentElement);}else{
      setItemToEdit(e.target);
    }

}

function setItemToEdit (item) {
  isEditMode = true;

  itemList.querySelectorAll('li').forEach(i => i.classList.remove('edit-mode'));

  item.classList.add('edit-mode');

  formBtn.innerHTML = '<i class = "fa-solid fa-pen"></i> Update Items ';
  formBtn.style.backgroundColor = '#228B22';

  itemInput.value = item.textContent;

}


function removeItem (item){
  if (confirm('Are You Sure?')){
    item.remove();

    // Remove item from storage
    removeItemFromStorage(item.textContent);
    checkUI();
  }
  
}
function removeItemFromStorage (item) {
  let itemsFromStorage = getItemsFromStorage();

  itemsFromStorage = itemsFromStorage.filter(i => i !== item);

  // Reset to local storage
  localStorage.setItem('items', JSON.stringify(itemsFromStorage));
}
function clearAll () {
  while(itemList.firstChild){
    itemList.removeChild(itemList.firstChild);
  }

  // Removing from storage
  localStorage.removeItem('items');

  checkUI();
}

function filterItem (e) {
  const items = itemList.querySelectorAll('li');
  const text = e.target.value.toLowerCase();

  items.forEach(item => {
    const itemName = item.firstChild.textContent.toLowerCase();

    if(itemName.indexOf(text) != -1) {
      item.style.display = 'flex';
    }
    else{
      item.style.display = 'none';
    }
  });
}

function checkIfItemExists (item) {
  const itemsFromStorage = getItemsFromStorage();
  return itemsFromStorage.includes(item);
}
function checkUI () {
  itemInput.value = '';
  const items = itemList.querySelectorAll('li');
  if(items.length === 0){
    clearBtn.style.display = 'none';
    itemFilter.style.display = 'none';
  }
  else{
    clearBtn.style.display= 'block';
    itemFilter.style.display= 'block';
  }


  formBtn.innerHTML = '<i class = "fa-solid fa-plus"></i> Add Item';
  formBtn.style.backgroundColor = '#333';

  isEditMode = false;
}

// Event Listeners
itemForm.addEventListener('submit',onAddItemSubmit);
itemList.addEventListener('click', onClickItem);
clearBtn.addEventListener('click', clearAll);
itemFilter.addEventListener('input', filterItem);
document.addEventListener('DOMContentLoaded', displayItems);

checkUI();

