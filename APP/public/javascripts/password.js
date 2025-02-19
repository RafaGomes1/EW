$(document).ready(function() {
    $('.passwordToggle').click(function() {
        $(this).toggleClass('fa-eye-slash fa-eye');
        var input = $(this).siblings('.pwd');
        if (input.attr('type') === 'password') {
            input.attr('type', 'text');
        } else {
            input.attr('type', 'password');
        }
    });
});