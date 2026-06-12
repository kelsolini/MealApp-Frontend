## MEALAPP FRONTEND
# HOSTED ON VERCEL

ADD RECIPE FROM LINK DOCS:

    Endringer                                                                 
                                                                            
  1. RecipeService.ts — ny importFromUrl-metode                             
                                                                            
  Følger nøyaktig samme mønster som de andre metodene. Definerer            
  IImportDraft (ingrediens-amount er number | null) og IImportResponse.     
  Skiller 404 (not_found) fra 422 og nettverksfeil (fetch_failed) via       
  axios.isAxiosError + error.response?.status.                            
                                                                          
  2. pages/ImportRecipePage.tsx — ny side på /importer                      
   
  URL-input med enter-støtte, tre visuelle tilstander (laster med spinner,  
  404-feil, 422/nettverksfeil). Når importen lykkes mappes amount: null → 0
  på ingrediensene (se punkt 5), og siden navigerer til /recipes/add med    
  utkastet i location.state.draft.                                        
                                                                          
  3. pages/AddRecipePage.tsx — leser router state                           
   
  Eneste endring: useLocation() legges til og draft leses fra               
  location.state. Sendes inn som initialData til RecipeForm. Ingen
  router-state → undefined → tomt skjema (uendret oppførsel for vanlig "Ny  
  oppskrift").                                                            
                                                                          
  4. components/Shared/Button.tsx — ny outlined-variant                   

  text-white flyttes fra base til hver enkelt variant, slik at outlined kan 
  bruke text-[#4c0000] normalt og hover:text-white. Ellers uendret.
                                                                            
  5. components/Shared/PageHeader.tsx — inngangspunkt       
                                                                          
  "Importer fra lenke" (outlined-stil) plassert til venstre for "+ Ny       
  oppskrift", både i desktop-headeren og i mobil-dropdown.
                                                                            
  6. routing/AppRouting.tsx + pages/index.ts                                
                                                                          
  Rute importer registrert, ImportRecipePage eksportert.                    
                                                            
  Om RecipeForm                                                             
                                                                          
  Ingen endringer i selve skjemakomponenten — den støtter allerede          
  forhåndsutfylling via initialData (brukt i EditRecipePage). amount-feltet
  viser allerede tomt ved verdi 0 (ing.amount || ""), så null-mapping i     
  importsteget (amount ?? 0) er tilstrekkelig.
