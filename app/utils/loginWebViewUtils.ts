/**
 * JavaScript code for injecting a back header into the login WebView
 */
export const getLoginWebViewHeaderScript = (): string => {
    return `
    (function() {
        // Wait for DOM to be fully loaded
        function setupHeader() {
            // Create header element if it doesn't exist
            if (!document.getElementById('mobileAppHeader')) {
                // Create header container
                const header = document.createElement('div');
                header.id = 'mobileAppHeader';
                header.style.position = 'fixed';
                header.style.top = '0';
                header.style.left = '0';
                header.style.right = '0';
                header.style.height = '120px';
                header.style.backgroundColor = 'transparent';
                header.style.display = 'flex';
                header.style.flexDirection = 'column';
                header.style.justifyContent = 'flex-end';
                header.style.paddingLeft = '16px';
                header.style.paddingBottom = '16px';
                header.style.zIndex = '9999';
                
                // Add header to body
                document.body.insertBefore(header, document.body.firstChild);
                
                // Add padding to body to account for fixed header
                document.body.style.paddingTop = '100px';
                document.body.style.boxSizing = 'border-box';
                
                // Ensure all content elements are properly positioned
                const allContentElements = document.querySelectorAll('body > *:not(#mobileAppHeader)');
                allContentElements.forEach(element => {
                    // Ensure this element is below the header
                    if (element.style.position === 'fixed' && 
                        element.style.top === '0px' &&
                        element !== header) {
                        element.style.top = '100px';
                    }
                });
            }
        }
        
        // Run immediately and also after a delay to handle dynamic content
        setupHeader();
        
        // Also run after page is fully loaded
        if (document.readyState === 'complete') {
            setTimeout(setupHeader, 300);
        } else {
            window.addEventListener('load', function() {
                setTimeout(setupHeader, 300);
            });
        }
    })();
    true;
  `;
};
