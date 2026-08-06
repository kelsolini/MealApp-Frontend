import { BrowserRouter, Route, Routes } from "react-router-dom";
import { HomePage, AddRecipePage, EditRecipePage, RecipePage, RecipeDetailPage, ShoppingListPage, WeekPlanPage, LoginPage } from '../pages/index';
import PageHeader from '../components/Shared/PageHeader';
import RequireAuth from '../components/RequireAuth';
import { AuthProvider } from "../contexts/AuthContext";
import { RecipeProvider } from "../contexts/RecipeContext";
import { FavoritesProvider } from "../contexts/FavoritesProvider";
import { ShoppingListProvider } from "../contexts/ShoppingListProvider";
import { WeekPlanProvider } from "../contexts/WeekPlanProvider";


const AppRouting = () => {
    return(
        <>
            <AuthProvider>
                <RecipeProvider>
                    <FavoritesProvider>
                        <ShoppingListProvider>
                        <WeekPlanProvider>
                        <BrowserRouter>
                        <PageHeader/>
                            <Routes>
                                <Route path="/login" element={ <LoginPage/> }/>
                                <Route element={ <RequireAuth/> }>
                                    <Route path="/" element={ <HomePage/> }/>
                                    <Route path="recipes" element={ <RecipePage/> }/>
                                    <Route path="weekplan" element={ <WeekPlanPage/> }/>
                                    <Route path="shoppinglist" element={ <ShoppingListPage/> }/>
                                    <Route path="recipes/add" element={ <AddRecipePage/> }/>
                                    <Route path="oppskrifter/:id" element={ <RecipeDetailPage/> }/>
                                    <Route path="recipe/:id/edit" element={ <EditRecipePage/> }/>
                                </Route>
                            </Routes>
                        </BrowserRouter>
                        </WeekPlanProvider>
                        </ShoppingListProvider>
                    </FavoritesProvider>
                </RecipeProvider>
            </AuthProvider>
        </>
    );
}

export default AppRouting;