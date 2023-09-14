const menuLinks = useRef(null);
    const mainHeaderLinks = useRef(null);
    const dropdowns = useRef(null);
    const searchBarInput = useRef(null);
    const statusButton = useRef(null);
    const popUp = useRef(null);
    const closeButton = useRef(null);
    const toggleButton = useRef(null);

    useLayoutEffect(() => {
        const menuLinkNodes = menuLinks.current.querySelectorAll('.menu-link');
        const mainHeaderLinkNodes = mainHeaderLinks.current.querySelectorAll('.main-header-link');
        const dropdownNodes = dropdowns.current.querySelectorAll('.dropdown');

        menuLinkNodes.forEach((link) => {
            link.addEventListener('click', function () {
                menuLinkNodes.forEach(lnk => lnk.classList.remove('is-active'));
                this.classList.add('is-active');
            });
        });

        mainHeaderLinkNodes.forEach((link) => {
            link.addEventListener('click', function () {
                mainHeaderLinkNodes.forEach(lnk => lnk.classList.remove('is-active'));
                this.classList.add('is-active');
            });
        });

        dropdownNodes.forEach((dropdown) => {
            dropdown.addEventListener('click', (e) => {
                e.stopPropagation();
                dropdownNodes.forEach((c) => c.classList.remove('is-active'));
                dropdown.classList.add('is-active');
            });
        });

        searchBarInput.current.focus(() => {
            document.querySelector('.header').classList.add('wide');
        }).blur(() => {
            document.querySelector('.header').classList.remove('wide');
        });

        document.addEventListener('click', (e) => {
            if (!statusButton.current.contains(e.target)) {
                dropdowns.current.classList.remove('is-active');
            }
        });

        dropdownNodes.forEach((dropdown) => {
            dropdown.addEventListener('click', (e) => {
                document.querySelector('.content-wrapper').classList.add('overlay');
                e.stopPropagation();
            });
        });

        document.addEventListener('click', (e) => {
            if (!e.target.classList.contains('dropdown')) {
                document.querySelector('.content-wrapper').classList.remove('overlay');
            }
        });

        statusButton.current.addEventListener('click', () => {
            if (!statusButton.current.classList.contains('open')) {
                document.querySelector('.overlay-app').classList.add('is-active');
            }
        });

        closeButton.current.addEventListener('click', () => {
            document.querySelector('.overlay-app').classList.remove('is-active');
        });

        statusButton.current.addEventListener('click', () => {
            popUp.current.classList.add('visible');
        });

        closeButton.current.addEventListener('click', () => {
            popUp.current.classList.remove('visible');
        });

        toggleButton.current.addEventListener('click', () => {
            document.body.classList.toggle('light-mode');
        });

        // Clean up event listeners on component unmount
        return () => {
            // Remove event listeners here
        };
    }, []);