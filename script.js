import {
  fetchData,
  createNavListDOM,
  createCardListDOM,
  handleActiveClassesDOM,
} from "./DOMandFetch.js";

// state of the application
let state = {
  // active: 1,
  // nPages: 0,
  // currentPageItems: [],
  // users: [],
  // itemsPerPage: 0,
};

// Actions
export const actions = {
  setup: "SETUP",
  updatePage: "UPDATE_PAGE",
};

const setUpPagination = async () => {
  /* 
		get all pagination details and call setState to update state
	*/
  const selectInput = document.querySelector("select");
  const itemsPerPage = parseInt(selectInput.value);
  const users = await fetchData();
  const nPages = Math.ceil(users.length / itemsPerPage);
  const currentPageItems = getCurrentPageItems({
    active: 1,
    itemsPerPage,
    users,
  });

  const newState = {
    active: 1,
    nPages,
    currentPageItems,
    users,
    itemsPerPage,
  };

  setState(actions.setup, newState);
};

function updatePage(newPageNo) {
  /* 
		get updated pagination details and call setState to update state
	*/
  let active = parseInt(newPageNo);
  if (active === 0 || active > state.nPages) {
    return;
  }
  const { itemsPerPage, users } = state;
  const currentPageItems = getCurrentPageItems({
    active: active,
    itemsPerPage,
    users,
  });
  const payload = {
    currentPageItems,
    active: active,
  };
  setState(actions.updatePage, payload);
}

function getCurrentPageItems({ active, itemsPerPage, users }) {
  /* 
		get current page items using the state values
	*/
  const currentPageItems = users.slice(
    (active - 1) * itemsPerPage,
    active * itemsPerPage
  );
  return currentPageItems;
}

function setState(type, newState) {
  /* 
		setState updates the state to new state
		also calls the render function which updates the DOM
	*/
  const prevState = state;
  switch (type) {
    case actions.setup: {
      state = { ...state, ...newState };
      render(type, { state, prevState: {} });
      break;
    }

    case actions.updatePage: {
      state = { ...state, ...newState };
      render(type, { state, prevState });
      break;
    }

    case "default":
      break;
  }
}

function addNavEventListenerDOM() {
  /* 
		add event listeners to the next and back buttons
	*/
  const nextBtn = document.querySelector(".next");
  const backBtn = document.querySelector(".back");
  nextBtn.addEventListener("click", () => updatePage(state.active + 1));
  backBtn.addEventListener("click", () => updatePage(state.active - 1));
}

function render(type, payload) {
  /* 
		makes changes to the dom based on the action type
		setup -> runs on load and when no of items per page is changed
		updatePage -> runs when a page no is updated
	*/
  switch (type) {
    case actions.setup: {
      const state = payload.state;
      const navList = createNavListDOM(state);
      const currentPage = createCardListDOM(state);
      document.querySelector(".nav").innerHTML = navList;
      document.querySelector(".pageItems").innerHTML = currentPage;
      addNavEventListenerDOM();
      handleActiveClassesDOM(payload, type);
      break;
    }

    case actions.updatePage: {
      const { state, prevState } = payload;
      const currentPage = createCardListDOM(state);
      document.querySelector(".pageItems").innerHTML = currentPage;
      handleActiveClassesDOM(payload, type);
      break;
    }

    case "default":
      break;
  }
}

window.updatePage = updatePage;

setUpPagination().then(() => {
  document.querySelector("select").addEventListener("change", setUpPagination);
});
