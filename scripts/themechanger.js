        function changeTheme() {
            document.getElementsByClassName("logopng")[0].classList.add('darktheme')
            document.getElementsByClassName("one")[0].classList.add('darktheme')
            document.getElementsByClassName("two")[0].classList.add('darktheme')
            document.getElementsByClassName("three")[0].classList.add('darktheme')
            document.getElementsByClassName("four")[0].classList.add('darktheme')
        }
        window.onload = function () {
            const handler = document.getElementsByClassName("dark")[0]
            handler.addEventListener('click', function () {
                changeTheme()
            })
        }
