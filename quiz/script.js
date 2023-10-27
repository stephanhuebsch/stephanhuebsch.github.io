// Expand and collapse all questions 

document.addEventListener('DOMContentLoaded', function () {
  const expandAllButton = document.getElementById('expandAll');
  const collapseAllButton = document.getElementById('collapseAll');
  const detailsElements = document.querySelectorAll('details');

  // Function to expand all details
  function expandAll() {
    detailsElements.forEach((details) => {
      details.setAttribute('open', 'true');
    });
  }

  // Function to collapse all details
  function collapseAll() {
    detailsElements.forEach((details) => {
      details.removeAttribute('open');
    });
  }

  expandAllButton.addEventListener('click', expandAll);
  collapseAllButton.addEventListener('click', collapseAll);
});
