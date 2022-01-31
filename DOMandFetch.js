import { actions } from "./script.js";

export async function fetchData() {
  /*
		get users from api
		returns array of users
		users = [{
			id: 1,
			name: "Leanne Graham",
			email: "leanne@gmail.com",
			image: "https://robohash.org/1"
		}, 
		...]
	*/
  try {
    const res = await fetch(
      "https://raw.githubusercontent.com/Rajavasanthan/jsondata/master/pagenation.json"
    );
    const data = await res.json();
    const users = data.map((user) => ({
      ...user,
      image: `https://robohash.org/${user.id}`,
    }));
    return users;
  } catch (err) {
    throw new Error(err.message);
  }
}

export function createNavListDOM(state) {
  /* 
		creates nav list DOM
	*/
  return `
			<button onClick="updatePage(1)" class="home">home</button>
			<button class="back">${`<`}</button>
			<ul class='navlist'>
				${(() => {
          let navList = "";
          for (let i = 1; i <= state.nPages; i++) {
            navList += `
						<li class="link" data-pageNo=${i} onClick="updatePage(${i})">${i}</li>
					`;
          }
          return navList;
        })()}
			</ul>
			<button class="next">${`>`}</button>
			<button onClick="updatePage(${state.nPages})" class="end">end</button>
		
	`;
}

export function createCardListDOM(state) {
  /* 
		creates card list dom
	*/
  return `
		<ul class="cardlist">
			${(() => {
        let pageItems = "";
        for (let item of state.currentPageItems) {
          pageItems += `
						
							<li class="card">
								<img src="${item.image}" alt="Avatar">
								<div class="id">
									id : ${item.id}
								</div>
								<div class="name">
									${item.name}
								</div>
								<div class="email">
									${item.email}
								</div>
							</li>
						
					`;
        }
        return pageItems;
      })()}
		</ul>
	`;
}

export function handleActiveClassesDOM({ state, prevState = {} }, type) {
  /* 
		handles active classes of home, end, back, next and page no links
		depending on the action type
	 */
  const home = document.querySelector(".home");
  const end = document.querySelector(".end");
  const currentPageLink = document.querySelector(
    `[data-pageNo='${state.active}']`
  );
  const prevPageLink = document.querySelector(
    `[data-pageNo='${prevState.active}']`
  );
  const next = document.querySelector(".next");
  const back = document.querySelector(".back");

  switch (type) {
    case actions.setup: {
      home.classList.add("active");
      currentPageLink.classList.add("active");
      next.classList.add("active");
      break;
    }
    case actions.updatePage: {
      if (state.active === 1) {
        home.classList.add("active");
        back.classList.remove("active");
      }
      if (state.active === state.nPages) {
        end.classList.add("active");
        next.classList.remove("active");
      }
      prevPageLink.classList.remove("active");
      currentPageLink.classList.add("active");
      if (prevState.active === 1 && state.active !== 1) {
        home.classList.remove("active");
        back.classList.add("active");
      }
      if (prevState.active === state.nPages && state.active !== state.nPages) {
        end.classList.remove("active");
        next.classList.add("active");
      }
      currentPageLink.scrollIntoView();
      break;
    }
    case "default":
      break;
  }
}
