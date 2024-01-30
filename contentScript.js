
(async () => {
    function sleep(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    const handleRoute = async (destinationUrl) => {
        const { pathname } = new URL(destinationUrl)
        console.log(pathname)
        switch (pathname) {
            case "/auth/login":
                // Simulate event to prevent disabled submit button
                const EVENT_OPTIONS = { bubbles: true, cancelable: false, composed: true };
                const EVENTS = {
                    BLUR: new Event("blur", EVENT_OPTIONS),
                    CHANGE: new Event("change", EVENT_OPTIONS),
                    INPUT: new Event("input", EVENT_OPTIONS),
                };

                const userInput = document.querySelector('[formcontrolname="user"]')
                const submitButton = document.querySelector('[type="submit"]')
                
                userInput.value = (await chrome.storage.sync.get("username")).username
                userInput.dispatchEvent(EVENTS.INPUT)
                userInput.dispatchEvent(EVENTS.BLUR)
                
                submitButton.click()

                await sleep(1000)

                // Couldn't auto log :P
                const passwordInput = document.querySelector('[formcontrolname="pass"]')
                passwordInput.dispatchEvent(EVENTS.INPUT)
                passwordInput.dispatchEvent(EVENTS.BLUR)
                break;

            case "/app/mi-cartera":
                await sleep(2000)

                const tableContainers = [...document.querySelectorAll('.mb-0.pe-none.ng-star-inserted')]
                // Remove last container (It isn't a table)
                tableContainers.pop()

                tableContainers.forEach((table) => {
                    let thElements = table.querySelectorAll('th')

                    let quantityThs = [...thElements].filter((element) => element.innerHTML.includes('Nominales'))
                    // If there is no "Nominales", use "Cuotapartes" for "Fondos de inversión" instead
                    if (quantityThs.length === 0) quantityThs = [...thElements].filter((element) => element.innerHTML.includes('Cuotapartes'))

                    const [variationTh] = [...thElements].filter((element) => element.innerHTML.includes('Variación (%)'))
                    const totalDailyVariationTh = variationTh.cloneNode(true)
                    totalDailyVariationTh.innerHTML = '<span class="text-size-4">Var día</span>'
                    variationTh.insertAdjacentElement('afterend', totalDailyVariationTh)


                    const tableRows = table.querySelectorAll('tbody tr')
                    const tickerRows = [...tableRows].filter((row) => row.classList.contains('tr-row-ticker'))

                    const rowVariations = [...tickerRows].map((row) => {
                        const variation = row.cells[variationTh.cellIndex].innerText
                        const quantity = row.cells[quantityThs[0].cellIndex].innerText
                        const [number] = variation.split(' ')
                        const dailyVariation = row.cells[variationTh.cellIndex].cloneNode(true)
                        dailyVariation.childNodes[0].childNodes[0].innerText = `${(+quantity * +number).toFixed(2)}`
                        row.cells[variationTh.cellIndex].insertAdjacentElement('afterend', dailyVariation)
                        return {
                            variation,
                            quantity
                        }
                    })

                    const cleanRowVariations = rowVariations.map(({ variation, quantity }) => {
                        const [number, percentage] = variation.split(' ')
                        const cleanPercentage = percentage.split("(")[1].split(")")[0]
                        return {
                            quantity: parseInt(quantity),
                            nominalVariation: parseFloat(number),
                            totalNominalVarition: +((parseInt(quantity) * parseFloat(number)).toFixed(2)),
                            percentageVariation: parseFloat(cleanPercentage)
                        }
                    })

                    const totalNominalVariation = cleanRowVariations.reduce((total, currentItem) => {
                        return total + currentItem.totalNominalVarition;
                    }, 0);

                    const totalPercentageVariation = cleanRowVariations.reduce((total, currentItem) => {
                        return total + currentItem.percentageVariation;
                    }, 0) / cleanRowVariations.length;

                    const cumulativeHistoricCell = table.querySelector(".tr-cumulative-performance__text_upper")

                    const cumulativeEarningsTodayCell = document.createElement("td")
                    cumulativeEarningsTodayCell.classList.add("tr-cumulative-performance__text", "text-size-4", "tr-cumulative-performance__text_upper")
                    cumulativeEarningsTodayCell.innerHTML = `$ ${totalNominalVariation.toFixed(2)} (${totalPercentageVariation.toFixed(2)}%)`
                    cumulativeEarningsTodayCell.style = `${totalNominalVariation < 0 ? "color: #ff565c" : "color: #00c794"} ; text-align: center`
                    cumulativeHistoricCell.insertAdjacentElement('afterend', cumulativeEarningsTodayCell)
                })
            default:
                break;
        }
    }

    
    // If tab is reloaded on auth login, the navigation event wont recognize it
    if(window.location.pathname === "/auth/login") handleRoute("https://clientes.balanz.com/auth/login")
    
    // Same with this one, I'm too lazy to spend more time on this :)
    if(window.location.pathname === "/app/mi-cartera") handleRoute("https://clientes.balanz.com/app/mi-cartera")


    // if navigation is handled by Balanz SPA it'll be handled by this event listener
    navigation.addEventListener('navigate', (e) => {
        handleRoute(e.destination.url)
    })


})();

