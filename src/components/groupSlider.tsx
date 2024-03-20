import { useState, useEffect } from "react";
import CardGrid from "./cardGrid";
import Product from "@/types/Product";
import { Product_Category } from "@/types/Product";

import { useSimpleTranslation } from "@/international/useSimpleTranslation";

export default function GroupSlider() {
    const t = useSimpleTranslation();

    const products = t.landingPage.sections.products.productsList; // Ajeitar toda a estrutura de dados - este é um teste
    const productCategories = t.landingPage.sections.products.productCategories; // Ajeitar toda a estrutura de dados - este é um teste

    const [activeCategory, setActiveCategory] = useState(productCategories[0]);
    const [activeType, setActiveType] = useState(activeCategory.types[0]);
    const [activeOrder, setActiveOrder] = useState("Default_Grid_Order");
    const [activeProducts, setActiveProducts] = useState(products);

    const [allIsSelected, setAllIsSelected] = useState(false);

    const [filterState, setFilterState] = useState("default");

    function sortByLowestPrice(a: Product, b: Product): number {
        return a.price - b.price;
    }

    function sortByHighestPrice(a: Product, b: Product): number {
        return b.price - a.price;
    }

    function handleSortByLowestPrice() {
        const sortedProducts = [...activeProducts].sort(sortByLowestPrice);
        setActiveProducts(sortedProducts);
    }

    function handleSortByHighestPrice() {
        const sortedProducts = [...activeProducts].sort(sortByHighestPrice);
        setActiveProducts(sortedProducts);
    }

    function filterProducts() {
        let filteredProducts = [...products];

        if (activeCategory) {
            filteredProducts = filteredProducts.filter((product) => product.category === activeCategory.name);
        }

        if (activeType) {
            filteredProducts = filteredProducts.filter((product) => product.type === activeType);
        }

        setActiveProducts(filteredProducts);
    }

    useEffect(() => {
        filterProducts();
    }, [activeCategory, activeType]);

    return (
        <div className="GroupSlider">
            <div className="GroupSlider_Header">
                <h2
                    className={allIsSelected ? "GroupSlider_Class Active_Class" : "GroupSlider_Class"}
                    onClick={() => {
                        setActiveProducts(products);
                        setAllIsSelected(true);
                    }}
                >
                    Todos
                </h2>

                {productCategories.map((category, index) => (
                    <h2
                        key={index}
                        className={`GroupSlider_Class ${activeCategory.key === category.key && !allIsSelected ? "Active_Class" : ""}`}
                        onClick={() => {
                            setActiveCategory(category);
                            setActiveType(category.types[0]);
                            setAllIsSelected(false);
                        }}
                    >
                        {category.name}
                    </h2>
                ))}
            </div>

            <div className="GroupSlider_Filter">
                {!allIsSelected && (
                    <div className="Filter_Types">
                        {activeCategory.types.map((type, index) => (
                            <div
                                key={index}
                                className={`Filter_Type ${activeType === type ? "Active_Type" : ""}`}
                                onClick={() => setActiveType(type)}
                            >
                                {type}
                            </div>
                        ))}
                    </div>
                )}

                <div className="Filter_Price_Range">
                    <button className="Filter_Price_Btn" onClick={handleSortByHighestPrice}>
                        <span className="material-icons">arrow_drop_up</span>
                        <p>Maior Valor</p>
                    </button>
                    <button className="Filter_Price_Btn" onClick={handleSortByLowestPrice}>
                        <span className="material-icons">arrow_drop_down</span>
                        <p>Menor Valor</p>
                    </button>
                    <button
                        className="Filter_Price_Btn"
                        onClick={() => {
                            filterProducts();
                        }}
                    >
                        <span className="material-icons">close</span>
                        <p>Limpar Filtros</p>
                    </button>
                </div>
            </div>

            <CardGrid content={activeProducts} order={activeOrder} />
        </div>
    );
}
