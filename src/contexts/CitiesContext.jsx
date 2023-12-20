import {
  createContext,
  useContext,
  useEffect,
  useReducer,
  useCallback,
} from "react";
import db from "../../firebase/firebase";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDoc,
  getDocs,
} from "firebase/firestore";

const CitiesContext = createContext();

const intialState = {
  cities: [],
  isLoading: false,
  currentCity: {},
  error: "",
};
function reducer(state, action) {
  switch (action.type) {
    case "loading":
      return { ...state, isLoading: true };
    case "cities/loaded":
      return { ...state, isLoading: false, cities: action.payload };

    case "city/loaded":
      return { ...state, isLoading: false, currentCity: action.payload };
    case "city/created":
      return {
        ...state,
        isLoading: false,
        cities: [...state.cities, action.payload],
        currentCity: action.payload,
      };
    case "city/deleted":
      return {
        ...state,
        isLoading: false,
        cities: state.cities.filter((city) => city.id !== action.payload),
        currentCity: {},
      };
    case "rejected":
      return { ...state, isLoading: false, error: action.payload };
    default:
      throw new Error("Unknown action type");
  }
}
function CitiesProvider({ children }) {
  const [{ cities, isLoading, currentCity, error }, dispatch] = useReducer(
    reducer,
    intialState
  );

  async function fetchCities() {
    dispatch({ type: "loading" });
    try {
      const citiesCollectionRef = collection(db, "cities");
      const data = await getDocs(citiesCollectionRef);
      const citiesList = data.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));
      dispatch({ type: "cities/loaded", payload: citiesList });
    } catch (err) {
      dispatch({
        type: "rejected",
        payload: "There was an error loading cities...",
      });
    }
  }

  useEffect(function () {
    fetchCities();
  }, []);

  const getCity = useCallback(
    async function getCity(id) {
      if (+id === currentCity.id) return;
      dispatch({ type: "loading" });
      try {
        const cityDoc = doc(db, "cities", id);
        const citySnapShot = await getDoc(cityDoc);
        const cityData = citySnapShot.data();
        dispatch({
          type: "city/loaded",
          payload: { ...cityData, id: citySnapShot.id },
        });
      } catch (err) {
        dispatch({
          type: "rejected",
          payload: "There was an error loading the city...",
        });
      }
    },
    [currentCity.id]
  );

  async function createCity(newCity) {
    dispatch({ type: "loading" });

    try {
      const docRef = await addDoc(collection(db, "cities"), newCity);
      dispatch({
        type: "city/created",
        payload: { ...newCity, id: docRef.id },
      });
    } catch (err) {
      alert("There was an error creating city.");
    }
  }

  async function deleteCity(id) {
    dispatch({ type: "loading" });
    try {
      await deleteDoc(doc(db, "cities", id));
      fetchCities();
      dispatch({ type: "city/deleted", payload: id });
    } catch (err) {
      alert("There was an error deleting city.");
    }
  }

  return (
    <CitiesContext.Provider
      value={{
        cities,
        isLoading,
        currentCity,
        error,
        getCity,
        createCity,
        deleteCity,
      }}
    >
      {children}
    </CitiesContext.Provider>
  );
}
function useCities() {
  const context = useContext(CitiesContext);
  if (context === undefined)
    throw new Error("CitiesContext was used outside the CitiesProvider");
  return context;
}
export { CitiesProvider, useCities };
