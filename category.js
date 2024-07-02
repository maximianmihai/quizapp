document.getElementById('categoryForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const category = document.getElementById('categorySelect').value;
    localStorage.setItem('selectedCategory', category);
    window.location.href = 'quiz.html'; 
});
