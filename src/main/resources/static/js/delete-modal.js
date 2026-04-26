
// Holds a reference to the card element being targeted for deletion
let targetCard = null;

/**
 * Opens the delete confirmation modal.
 *
 * @param {HTMLElement} btn   - The delete button that was clicked (used to find the parent card)
 * @param {string}      name  - The survey name to display inside the modal
 *
 * Example usage on a delete button:
 *   <button onclick="openDeleteModal(this, 'My Survey')">Delete</button>
 */
function openDeleteModal(btn, name) {
  // Walk up the DOM to find the survey card this button belongs to
  targetCard = btn.closest('.survey-card');
  const id = btn.getAttribute("data-id");
  // Inject the survey name into the modal badge
  document.getElementById('modal-survey-name').textContent = name;

  // Show the modal
  document.getElementById('delete-modal').classList.add('open');

  // Prevent background scrolling while modal is open
  document.body.style.overflow = 'hidden';
}


function closeDeleteModal() {
  document.getElementById('delete-modal').classList.remove('open');
  document.body.style.overflow = '';
  targetCard = null;
}

/**
 * Clicking the dark backdrop (overlay) outside the modal box closes it.
 * The check ensures clicks on the modal box itself are ignored.
 *
 * @param {MouseEvent} e
 */
function handleOverlayClick(e) {
  if (e.target === document.getElementById('delete-modal')) {
    closeDeleteModal();
  }
}


async function confirmDelete(btn) {
  if (!targetCard) return;
  btn.disabled = true; 
  // Animate card out
  targetCard.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
  targetCard.style.opacity = '0';
  targetCard.style.transform = 'scale(0.92)';
  const id = document.getElementById("card-delete-btn").getAttribute("data-id");
  // Remove from DOM after animation finishes
   try {
      const res = await fetch(`/delete/survey/${id}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });

      if (!res.ok) throw new Error(`Server error: ${res.status}`);

      setTimeout(() => {
        targetCard.remove();
        closeDeleteModal();
        btn.disabled = false; 
        btn.textContent="Delete Forever"
      }, 300);

      }catch(err){
        console.error(err);
        btn.disabled = false; 
        btn.textContent="Delete Forever"
      }finally{
        btn.textContent="Deleting...."
      }

}

// Close modal when user presses the Escape key
document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') {
    closeDeleteModal();
  }
});
