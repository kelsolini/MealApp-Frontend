import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage, AddRecipePage, EditRecipePage, RecipePage, RecipeDetailPage, ShoppingListPage, WeekPlanPage } from '../pages/index';
import PageHeader from '../components/Shared/PageHeader';
import { RecipeProvider } from "../contexts/RecipeContext";
import { FavoritesProvider } from "../contexts/FavoritesProvider";
import { ShoppingListProvider } from "../contexts/ShoppingListProvider";
import { WeekPlanProvider } from "../contexts/WeekPlanProvider";

const AppRouting = () => {
    return(
        <>
            <RecipeProvider>
                <FavoritesProvider>
                    <ShoppingListProvider>
                    <WeekPlanProvider>
                    <BrowserRouter>
                    <PageHeader/>
                        <Routes>
                            <Route path="/" element={ <HomePage/> }/>  
                            <Route path="recipes" element={ <RecipePage/> }/>   
                            <Route path="weekplan" element={ <WeekPlanPage/> }/>  
                            <Route path="shoppinglist" element={ <ShoppingListPage/> }/>   
                            <Route path="recipes/add" element={ <AddRecipePage/> }/>
                            <Route path="oppskrifter/:id" element={ <RecipeDetailPage/> }/>
                            <Route path="recipe/:id/edit" element={ <EditRecipePage/> }/>
                        </Routes>
                    </BrowserRouter>
                    </WeekPlanProvider>
                    </ShoppingListProvider>
                </FavoritesProvider>
            </RecipeProvider>
        </>
    );
}

export default AppRouting;