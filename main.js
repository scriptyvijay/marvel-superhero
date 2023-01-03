let publicKey = "c4558e3e98639735a3ab3bc85dd5de2b";
let cardDiv = document.getElementById("cards-container");
let searchBar = document.getElementById("searchInput");
let favorites = JSON.parse(localStorage.getItem("fav")) || [];

// ! Onload Function for first call
window.onload = () => {
	emptyData();
};

// Empty data function

const emptyData = async function getData() {
	const res = await fetch("https://gateway.marvel.com:443/v1/public/characters?&ts=abcd&apikey=c4558e3e98639735a3ab3bc85dd5de2b&hash=30f530009b846bdb8bcdfc0cfebba962");
	const resJson = await res.json();
	const data = await resJson.data.results;

	// Remove all child
	while (cardDiv.firstChild) {
		await cardDiv.removeChild(cardDiv.firstChild);
	}

	// Creating new child with API Data
	data.forEach((e) => {
		let newDiv = document.createElement("div");
		cardDiv.appendChild(newDiv);
		newDiv.innerHTML = `<div>
	<h4>${e.name}</h4>
	</div>`;

		let img = document.createElement("img");
		let path = e.thumbnail.path + "." + e.thumbnail.extension;
		newDiv.appendChild(img);
		img.setAttribute("src", path);
		img.setAttribute("alt", e.name);
		img.addEventListener("click", (ele) => {
			window.localStorage.setItem("search", JSON.stringify(e));
			window.location.href = "./superhero-bio.html";
		});

		let text = document.createElement("p");
		text.textContent = e.description;
		newDiv.appendChild(text);
		let btn = document.createElement("button");
		newDiv.appendChild(btn);
		btn.setAttribute("id", "btn");
		btn.textContent = "Add to Fav ❤️";
		btn.addEventListener("click", () => {
			favorites.push(e);
			// ! Pushing data to localstorage
			window.localStorage.setItem("fav", JSON.stringify(favorites));
		});
	});
};

// ! Main Fetch URL Function
async function fetchURL(value) {
	if (value == "") {
		dataFunc();
		return;
	} else {
		try {
			// ! Fetching Character
			let res = await fetch(`http://gateway.marvel.com/v1/public/characters?nameStartsWith=${value}&ts=abcd&apikey=c4558e3e98639735a3ab3bc85dd5de2b&hash=30f530009b846bdb8bcdfc0cfebba962`);
			let data = await res.json();
			let dataArr = await data.data.results;
			return dataArr;
		} catch {
			console.error("Error in Fetching SuperHeros");
		}
	}
}

// ! Event listener for searchbar
searchBar.addEventListener("keyup", (ele) => {
	if (ele.target.value === "" || ele.target.value === " ") {
		emptyData();
	} else {
		let data;
		const dataFunc = (async function getData() {
			data = await fetchURL(ele.target.value);
			while (cardDiv.firstChild) {
				await cardDiv.removeChild(cardDiv.firstChild);
			}
			data.forEach((e) => {
				if (e.description) {
					let newDiv = document.createElement("div");
					cardDiv.appendChild(newDiv);
					newDiv.innerHTML = `
					<h4>${e.name}</h4>
					`;
					let img = document.createElement("img");
					let path = e.thumbnail.path + "." + e.thumbnail.extension;
					newDiv.appendChild(img);
					img.setAttribute("src", path);
					img.setAttribute("alt", e.name);
					img.addEventListener("click", (ele) => {
						window.localStorage.setItem("search", JSON.stringify(e));
						window.location.href = "./superhero-bio.html";
					});

					let text = document.createElement("p");
					text.textContent = e.description;
					newDiv.appendChild(text);
					let btn = document.createElement("button");
					newDiv.appendChild(btn);
					btn.setAttribute("id", "btn");
					btn.textContent = "Add to Fav ❤️";
					btn.addEventListener("click", () => {
						favorites.push(e);
						window.localStorage.setItem("fav", JSON.stringify(favorites));
					});
				}
			});
		})();
	}
});
