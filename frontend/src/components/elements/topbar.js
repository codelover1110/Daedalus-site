import React, { useState, useEffect } from "react";
import firebase from "firebase/app";
import "firebase/firestore";
import { Link } from "react-router-dom";
import { useAuth } from '../../contexts/auth_ctx'
import { FaSearch } from 'react-icons/fa'
import {config} from "../../config";
// import Leftbar from "./leftbar";

const db = firebase.firestore();

let allSymbols;
let admin;

function Topbar() {

  const { currentUser } = useAuth()
  const [fundsLoader, setFundsLoader] = useState('')
  const [funds, setFunds] = useState('')
  const [menuActive, setMenuActive] = useState(false)

  const mobileMenu = React.createRef();
  const hamburger = React.createRef();
  const results = React.createRef();
  const searchBar = React.createRef();
  const searchBarEl = React.createRef();


  // fundsLoader: "",
  // //     funds: "",
  // //     menuActive: false,


  useEffect(() => {

    fetch(
      `${config.iex_base_url}/stable/ref-data/symbols?token=${config.iex_publish_key}`,
    )
      .then(res => res.json())
      .then(result => {
        allSymbols = result.map(val => {
          return val;
        });
      });
    if (!!currentUser) {
      db.collection("users")
        .doc(currentUser.uid)
        .onSnapshot(
          function (doc) {
            if (typeof doc.data() !== "undefined") {
              this.setState({
                funds: `$${this.numberWithCommas(
                  Number(doc.data()["currentfunds"]),
                )}`,
                fundsLoader: true,
              });
              admin = doc.data()["admin"];
            }
          }.bind(this),
        );
    }

  }, [currentUser])


  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     fundsLoader: "",
  //     funds: "",
  //     menuActive: false,
  //     user: null
  //   };

  //   this.mobileMenu = React.createRef();
  //   this.hamburger = React.createRef();
  //   this.results = React.createRef();
  //   this.searchBar = React.createRef();
  //   this.searchBarEl = React.createRef();
  //   this.searchStocks = this.searchStocks.bind(this);
  // }

  /*
   * searches stocks
   * @param {e} value to search for
   */

  function searchStocks(e) {
    let results = this.results.current;
    results.innerHTML = "";
    let b = 0;
    let filter = this.searchBarEl.current.value.toUpperCase();
    if (e.key === "Enter") {
      window.location = `/stocks/${filter}`;
    }
    if (filter.length === 0) {
      results.innerHTML = "";
      results.style.display = "none";
    } else {
      for (let i = 0; i < allSymbols.length; i++) {
        let splitSymbol = allSymbols[parseInt(i)].symbol.split("");
        let splitFilter = filter.split("");
        for (let a = 0; a < splitFilter.length; a++) {
          if (
            allSymbols[parseInt(i)].symbol.indexOf(filter) > -1 &&
            splitSymbol[parseInt(a)] === splitFilter[parseInt(a)]
          ) {
            if (a === 0) {
              results.style.display = "flex";
              let el = document.createElement("li");
              el.innerHTML = `<a href="/stocks/${allSymbols[parseInt(i)].symbol
                }"><h4>${allSymbols[parseInt(i)].symbol}</h4><h6>${allSymbols[parseInt(i)].name
                }</h6></a>`;
              results.appendChild(el);
              b++;
            }
          }
        }
        if (b === 10) {
          break;
        }
      }
    }
  }

  function numberWithCommas(x) {
    return x.toLocaleString();
  }


  // componentDidMount() {


  // let user = firebase.auth().currentUser.uid;
  // if (this.state.user) {



  // let mobileMenu = this.mobileMenu.current;
  // let hamburger = this.hamburger.current;
  // hamburger.addEventListener("click", e => {
  //   e.currentTarget.classList.toggle("is-active");
  //   if (!this.state.menuActive) {
  //     mobileMenu.style.display = "flex";
  //     this.setState({ menuActive: true });
  //     setTimeout(() => {
  //       mobileMenu.style.left = "0px";
  //     }, 200);
  //   } else {
  //     mobileMenu.style.left = "-100%";
  //     this.setState({ menuActive: false });
  //     setTimeout(() => {
  //       mobileMenu.style.display = "none";
  //     }, 400);
  //   }
  // });
  // }
  // }

  return (
    <nav>

      <div ref={mobileMenu} className="mobileMenu" id="mobileMenu">
        {/* <Leftbar></Leftbar> */}
      </div>
      {currentUser !== null &&
        <div className="dashboard__topbar flex">
          <div className="hamburger" ref={hamburger}>
            <div className="hamburger__container">
              <div className="hamburger__inner" />
              <div className="hamburger__hidden" />
            </div>
          </div>
          <div
            className="topbar__search flex flex-1 items-center"
            ref={searchBar}
            id="topbar__searchbar">
            <FaSearch size="16" />
            <input
              autoCorrect="off"
              autoCapitalize="off"
              spellCheck="false"
              type="text"
              id="searchBar"
              ref={searchBarEl}
              className="topbar__search__input form-input rounded-sm bg-transparent text-white border-0 focus:border-0  px-4 h-8 font-sans placeholder-sm"
              // onKeyUp={searchStocks}
              placeholder="Search by symbol"
              onFocus={() => {
                if (results.current.firstChild) {
                  results.current.style.display = "flex";
                }
                searchBar.current.style.boxShadow =
                  "0px 0px 30px 0px rgba(0,0,0,0.10)";
                results.current.style.boxShadow =
                  "0px 30px 20px 0px rgba(0,0,0,0.10)";
              }}
              onBlur={() => {
                setTimeout(() => {
                  if (results.current) {
                    results.current.style.display = "none";
                  }
                }, 300);

                searchBar.current.style.boxShadow = "none";
              }}
              autoComplete="off"
            />

            <ul className="topbar__results" id="results" ref={results} />
          </div>

          <div className="topbar__user">
            {admin && (
              <Link to="/admin">
                <div className="topbar__dev">
                  <h4>DEV</h4>
                </div>
              </Link>
            )}
            {fundsLoader === true && (
              <div className="topbar__power">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <g>
                    <path fill="none" d="M0 0h24v24H0z" />
                    <path d="M18 7h3a1 1 0 0 1 1 1v12a1 1 0 0 1-1 1H3a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h15v4zM4 9v10h16V9H4zm0-4v2h12V5H4zm11 8h3v2h-3v-2z" />
                  </g>
                </svg>
                <h3>{funds}</h3>
              </div>
            )}
            <span className="topbar__name font-sans"> &nbsp;{!!currentUser ? `${currentUser.displayName} ${currentUser.email}` : ''}</span>
          </div>

        </div>
      }
    </nav>

  );
}
export default Topbar
