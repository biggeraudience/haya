import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { BrowserRouter } from "react-router-dom";

// Import all your providers
import UserProvider from "./context/UserContext";
import ClothingShopProvider from "./context/ClothingShopContext";
import VeilsShopProvider from "./context/VeilsShopContext";
import JewelryShopProvider from "./context/JewelryShopContext";
import ShoesShopProvider from "./context/ShoesShopContext";
import BagsShopProvider from "./context/BagsShopContext";
import FragrancesShopProvider from "./context/FragrancesShopContext";
import { CartContextProvider } from "./context/CartContextContext";
import FilterProvider from "./context/FilterContext";
import { SettingsProvider } from "./context/SettingsContext";
import { MessageProvider } from "./context/MessageContext.jsx";
import OrderProvider from "./context/OrderContext";
import { NotificationProvider } from "./context/NotificationContext";

// New mens/womens fabrics and mens shop providers
import MensClothingShopProvider from "./context/MensClothingShopContext";
import MensAccessoriesShopProvider from "./context/MensAccessoriesShopContext";
import MensCapsShopProvider from "./context/MensCapsShopContext";
import MensPerfumesShopProvider from "./context/MensPerfumesShopContext";
import MensFabricsShopProvider from "./context/MensFabricsShopContext";
import MensShoesShopProvider from "./context/MensShoesShopContext";
import MensBagsShopProvider from "./context/MensBagsShopContext"; // <--- Added this line
import WomensFabricsShopProvider from "./context/WomensFabricsShopContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <SettingsProvider>
      <UserProvider>
        <MessageProvider>
          <NotificationProvider>
            <FragrancesShopProvider>
              <JewelryShopProvider>
                <ShoesShopProvider>
                  <BagsShopProvider>
                    <VeilsShopProvider>
                      <ClothingShopProvider>
                        <MensClothingShopProvider>
                          <MensAccessoriesShopProvider>
                            <MensCapsShopProvider>
                              <MensPerfumesShopProvider>
                                <MensFabricsShopProvider>
                                  <MensShoesShopProvider>
                                    <MensBagsShopProvider>
                                      <WomensFabricsShopProvider>
                                        <OrderProvider>
                                          <CartContextProvider>
                                            <FilterProvider>
                                              <BrowserRouter>
                                                <App />
                                              </BrowserRouter>
                                            </FilterProvider>
                                          </CartContextProvider>
                                        </OrderProvider>
                                      </WomensFabricsShopProvider>
                                    </MensBagsShopProvider>
                                  </MensShoesShopProvider>
                                </MensFabricsShopProvider>
                              </MensPerfumesShopProvider>
                            </MensCapsShopProvider>
                          </MensAccessoriesShopProvider>
                        </MensClothingShopProvider>
                      </ClothingShopProvider>
                    </VeilsShopProvider>
                  </BagsShopProvider>
                </ShoesShopProvider>
              </JewelryShopProvider>
            </FragrancesShopProvider>
          </NotificationProvider>
        </MessageProvider>
      </UserProvider>
    </SettingsProvider>
  </React.StrictMode>
);
