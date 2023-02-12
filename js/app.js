"use strict"
console.log("We are live!");

/*
1. Alla produkter från det öppna API:et visas på webbplatsen med all data om varje produkt.         -- check --

2. Det går att beställa produkter (genom att klicka på “köp”-knapp) och användaren ska då           -- check --
behöva skicka med namn, e-post, adress samt välja fraktvillkor (det ska inte gå att skicka          inget tvång på @. men hur fixar man det? required funkar ej på input, hur då?      
beställningar utan att all data har angetts. Produktens id skickas med automatiskt). Beställningar
skickas med API till en egen databas i Google Firebase där de lagras.

3. En admin-sida skapas som använder Firebase API för att kunna se, ändra och ta bort ordrar.       -- check! --
Anslutningen till Firebase ska vara säker (cors och/eller autentisering)

4. Källkoden versionshanteras med Github.                                                           -- check! --

5. Webbplatsen publiceras                                                                           -- check! --

FÖR VG:
1. Det går att visa alla produkter baserat på respektive kategori - hur?                            -- check --

2. Det är möjligt för en användare att beställa flera produkter samtidigt (via produkternas         -- check --
“köp”/”lägg i varukorgen”-knappar).

3. En varukorgssida listar alla produkter (med minst produktnamn och pris) som valts med           -- check! --
möjlighet att ta bort produkter innan beställning. Om webbsidan laddas om ska produkterna
fortfarande finnas kvar i varukorgen.

4. En ikon för varukorgen visar hur många produkter som ligger i varukorgen.                        -- check! --
*/

// Connection HTML
const headerEl = document.getElementById("header");
const sectionEl = document.getElementById("webbutik");
// alt sidor
const sectionMenEl = document.getElementById("men");
const sectionWomanEl = document.getElementById("woman");
const sectionElectricEl = document.getElementById("el");
const sectionJewelryEl = document.getElementById("jew");
// cart
const sectionCartEl = document.getElementById("showCart"); // function(toogle-show/hide kundvagn)
const kundvagnbuttonEl = document.getElementById("kundvagnbutton"); // knappen(toggla kundvagn)
const tillagdEl = document.getElementById("tillagd"); // skriver HTML
const totalSumCartEl = document.getElementById("totalSumCart"); // skriver HTML
const checkoutEl = document.getElementById("checkout"); // skriver HTML
const checkformEl = document.getElementById("checkform"); // skriver HTML
// Checkout
const sectionCheckoutEl = document.getElementById("showCheckout"); // funtion(show checkout sectionen)
// Count items Cart
const cartItemNumberEl = document.getElementById("cartItemNumber");
// form/buyer
const nameEl = document.getElementById("skurt");
const emailEl = document.getElementById("epost");
const addressEl = document.getElementById("address");
const shippingEl = document.getElementById("shipping");


//********************************************************************    Header    ****************************************************************************** */

    headerEl.innerHTML = `
    <li><a class="catergory-button" data-category="all">All</a></li>
    <li><a class="catergory-button" data-category="men's clothing">Men's clothing</a></li>
    <li><a class="catergory-button" data-category="women's clothing">Womens's clothing</a></li>
    <li><a class="catergory-button" data-category="electronics">Electronics</a></li>
    <li><a class="catergory-button" data-category="jewelery">Jewelery</a></li>
    `;

//**************************************************************************************************************************************************************** */

//*******************************************************************   GET fetch()    *************************************************************************** */

// -- GET -- fetch(webbbutiks data/artiklar mm.)
fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(data => {

    let categoryButtons = document.getElementsByClassName("catergory-button");
    for (let i = 0; i < categoryButtons.length; i++) {
        categoryButtons[i].addEventListener("click", function() {
            getContent(data, this.getAttribute("data-category"));
        });
    }
    getContent(data, "all");
})
    .catch(error => console.log(error));

// funktioner
function getContent(data, selectedCategory) {

    const content = data.filter(content => {
        if (selectedCategory === "all") {
            return true;
        } else if (selectedCategory === content.category) {
            return true;
        } else {
        return false;
    }});

    console.log(content);

    // nollställer värdena för varje gång sidan laddas in (för att undvika dubletter av utskriven data.)
    sectionEl.innerHTML = "";

    for (let i = 0; i < content.length; i++) {

        //console.log(data);

        sectionEl.innerHTML += `

        <article class="articleFrame">
            <h1>${content[i].title}</h1>
            <p><b>Category:</b> ${content[i].category}</p>
            <img src="${content[i].image}" alt="pic">
            <p><b>${content[i].price} kr</b></p>
            <p id="description"><b>Product description: </b>${content[i].description}</p>
            <p><b>Product_id:</b> ${content[i].id}</p>
            <br>
            <p><b>Rating:<br>rate:</b> ${content[i].rating.rate} <b>count:</b> ${content[i].rating.count}</p>
            <br>
            <input type="button" value="Lägg till" onClick="addItem('${content[i].id}', '${content[i].title.replace("'","")}', '${content[i].price}')">
            <hr>
        </article> 
        `;

    }
}

//**************************************************************************************************************************************************************** */

//****************************************************************   POST fetch()?   ***************************************************************************** */

// -- POST -- funktionen ... Lägg till artikel
    function addUser() {

        console.log('körs........')

        // Hämta in data från <form>
        const name = nameEl.value.trim();
        const email = emailEl.value.trim();
        const address = addressEl.value.trim();
        const shipping = shippingEl.value.trim();

        if (!name || !email || !address || !shipping) {
            console.log("Name, Address or Email is missing")
            return;
        }

        const idproducts = productarray.map(content => {
            return {
                "stringValue": content.id // hämtar bara id
            }
        });

        // sätt samman användarens värden till JSON-objekt
        let body = JSON.stringify(
            {
            "fields": {
                "Name": { 
                    "stringValue": name
                },
                "email": {
                    "stringValue": email
                },
                "address": {
                    "stringValue": address
                },
                "shipping": {
                    "stringValue": shipping
                },
                "idproduct": {
                    "arrayValue": {
                        "values": idproducts
                    } 
                }
            }   
        }
    );
    
        // Skicka API -- POST -- skickar in värden(användaren).                            fetch-anrop med POST-metod
        fetch("https://firestore.googleapis.com/v1/projects/webbshop-408a2/databases/(default)/documents/webbshop", {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: body
        })
            .then(res => res.json())
            .then(data => console.log(data))
            .catch(error => console.log(error));            
            console.log(body);

            localStorage.clear();   // Rensa localStorage efter POST = true.
            setTimeout(() => location.reload(), 2000); // reload sida efter 2 sekunder från POST ***********************************************************

};

//**************************************************************************************************************************************************************** */


//***********************************************************   Produkt funktioner   ***************************************************************************** */


// Skapar Array för produkter (genom att deklarera array utanför funktioner så kommer vi åt den överallt). hämtar localStorage
let productarray = JSON.parse(localStorage.getItem("output")) || [];

// addItem() = Funktion som adderar produkter till kundvagn.
function addItem(id, item, price) {
    
// .push lägger till, i detta fall 'objekt-värdena' i array.
    productarray.push({
        id,
        item,
        price});

/********************************************  Projekt localStorage  ****************************************** */

    // Konvertera array-objektet till JSON, lagra i variabel json                                                                       2.
    let json = JSON.stringify(productarray); // <-- här måste jag lägga in 'productArray' om ja vill att localStorage ska ta in fler object! -- 'org: (object)'

    // Spara json-datan i localstorage-variabeln "output"                                                                       3.
    localStorage.setItem("output", json);

    cartItemCounter();  // Skriver till HTML på vår span (kundvagn) antal varor vi lägger i.     -- check! --
    updateCart();       // function uppdaterar min cart efter borttag av vara.
    //localStorage.clear(); // använd vid felsökning
    }

    function updateCart() {
        
        let sum = 0;
        let html = "";
        for (let i = 0; i < productarray.length; i++) {
            let item = productarray[i];
            sum += parseFloat(item.price);
            html += `
            <br>
            <tr>
                <td>${item.item}</td>
                <td>|</td>
                <td><b>${item.price} kr</b></td>
                <td><input type="button" value="-" onClick="deleteOneItem('${item.id}','${i}')"></td>
            </tr>`;
        }

        tillagdEl.innerHTML = html;
        totalSumCartEl.innerHTML = `
        <hr id="cartHR">
        <b>Total Summa: <span id="totalPrice">${sum.toFixed(2)} kr</b></span>
        <input type="button" id="checkoutButton" value="check out" onClick="checkOut(${sum.toFixed(2)}, showCheckout(), hideWebbutik())">`;
    
    }

    // Kallar funktioner igen efter borttag av varor och uppdatera cart.
    updateCart();        // function uppdaterar min cart efter borttag av vara.
    cartItemCounter();   // function uppdaterar min cartItemCounter efter borttag av vara (siffran som visar föremål i korg).
    

// checkout function = hämta valda artiklar man betalar
function checkOut(sum) {

    // Nollställa gammal utskrivt för varje gång funktionen körs
    checkoutEl.innerHTML = "";
    checkformEl.innerHTML = "";

    for (let i = 0; i < productarray.length;i++) {
        console.log(productarray[i]);

    checkoutEl.innerHTML += `
        <p>
        <b>Produkt id: ${productarray[i].id}<br>
        Produkt: ${productarray[i].item}<br>
        Pris: ${productarray[i].price}kr<br>
        <br>
        </p>
        <hr>
    `
}

    checkformEl.innerHTML += `
    <hr id="cartHR">
    <p><b>Total summa: ${sum} kr <br><p>
    <br>
    `
}

//**************************************************************************************************************************************************************** */


//**************************************************************  functioner (add/delete) - hide/show)  ********************************************************** */

// cartItemCounter() {
function cartItemCounter() {   
    // Skriver till HTML på vår span (kundvagn) antal varor vi lägger i.     -- check! --
    let count = cartItemNumberEl.innerHTML = productarray.length;
    return count;
}

// Shopping cart knappar!
function plusOneItem() {

    // senare project att utveckla vidare
   
}

function deleteOneItem(id, index) {

    //let funka = productarray.findIndex(item => item.id === id); // <-- org - Hade en tanke men funkar utan.
    productarray.findIndex(item => item.id === id); //ny
  
    productarray.splice(index, 1);
  
    let json = JSON.stringify(productarray);
    localStorage.setItem("output", json);
  
    cartItemCounter();
    updateCart();
  }
  
// GÖM cart
function hideCart() {
    sectionCartEl.classList.toggle("showCart");
}

// Display showCheckout
function showCheckout() {
    sectionCheckoutEl.classList.add("showCheckout");
}
// Hide webbutik-section
function hideWebbutik() {
    sectionEl.classList.add("webbutik");
}


// eventhanterare
kundvagnbuttonEl.addEventListener("click", hideCart); // aktiverar function hideCart som togglar show/hide