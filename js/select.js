import { songs } from './constants.js';

export default class Select {
  constructor(element) {
    this.element = element;
    this.customDropdownContainer = document.createElement('div');
    this.customDropdownValue = document.createElement('span');
    this.customDropdownOptions = document.createElement('ul');
    this.options = getFormattedOptions(element.querySelectorAll('option'));
    setupCustomElement(this);
    element.style.display = 'none';
    element.after(this.customDropdownContainer);
  }

  get selectedOption() {
    return this.options.find(option => option.selected);
  }

  get selectedOptionIndex() {
    return this.options.indexOf(this.selectedOption);
  }

  selectValue(value) {
    const prevSelectedOption = this.selectedOption;

    prevSelectedOption.selected = false;
    prevSelectedOption.element.selected = false;

    const newSelectedOption = this.options.find(
      option => option.value === value
    );

    newSelectedOption.selected = true;
    newSelectedOption.element.selected = true;

    this.customDropdownValue.textContent = newSelectedOption.label;
    this.customDropdownOptions
      .querySelector(`[data-value='${prevSelectedOption.value}']`)
      .classList.remove('selected');

    const newCustomElement = this.customDropdownOptions.querySelector(
      `[data-value='${newSelectedOption.value}']`
    );

    newCustomElement.classList.add('selected');
    newCustomElement.scrollIntoView({ block: 'nearest' });
  }
}

function getFormattedOptions(optionElements) {
  return [...optionElements].map(optionElement => ({
    value: optionElement.value,
    label: optionElement.label,
    selected: optionElement.selected,
    element: optionElement,
  }));
}

function setupCustomElement(select) {
  select.customDropdownContainer.classList.add('custom-select-container');
  select.customDropdownContainer.tabIndex = 0;

  select.customDropdownValue.classList.add('custom-select-value');
  select.customDropdownValue.textContent = select.selectedOption.textContent;
  select.customDropdownContainer.append(select.customDropdownValue);

  select.customDropdownOptions.classList.add('custom-select-options');

  let selectIndex = 0;

  select.options.forEach(option => {
    const optionElement = document.createElement('li');

    optionElement.classList.add('custom-select-option');
    optionElement.classList.toggle('selected', option.selected);
    optionElement.textContent = songs[selectIndex++];
    optionElement.dataset.value = option.value;
    optionElement.addEventListener('click', () => {
      select.selectValue(option.value);
      select.customDropdownOptions.classList.remove('show');
    });

    select.customDropdownOptions.append(optionElement);
  });

  select.customDropdownContainer.append(select.customDropdownOptions);

  select.customDropdownValue.addEventListener('click', () => {
    select.customDropdownOptions.classList.toggle('show');
  });

  select.customDropdownContainer.addEventListener('blur', () => {
    select.customDropdownOptions.classList.remove('show');
  });

  let searchTerm = '';
  let debounceTimeout;

  select.customDropdownContainer.addEventListener('keydown', e => {
    switch (e.code) {
      case 'Space':
        select.customDropdownOptions.classList.toggle('show');
        break;

      case 'ArrowUp':
        const prevOption = select.options[select.selectedOptionIndex - 1];

        prevOption && select.selectValue(prevOption.value);
        break;

      case 'ArrowDown':
        const nextOption = select.options[select.selectedOptionIndex + 1];

        nextOption && select.selectValue(nextOption.value);
        break;

      case 'Enter':
      case 'Escape':
        select.customDropdownOptions.classList.remove('show');
        break;

      default:
        searchTerm += e.key;
        clearTimeout(debounceTimeout);
        debounceTimeout = setTimeout(() => {
          searchTerm = '';
        }, 500);

        const searchedOption = select.options.find(option =>
          option.label.toLowerCase().startsWith(searchTerm)
        );

        searchedOption && select.selectValue(searchedOption.value);
    }
  });
}
