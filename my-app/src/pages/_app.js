import "@/styles/globals.css";
import {Provider} from "react-redux";
import {store} from "@/config/redux/store.js";


export default function App({Component,pageProps}) {
  return (
    <Provider store={store}>
        <Component {...pageProps}/>

    </Provider>
    
  )
}


//provider for easy way  vrna hume ekk ke ander ekk har ekk contextApi dalni pdti 