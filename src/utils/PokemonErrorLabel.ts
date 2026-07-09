export const getNoPokemonFoundMessage = (search: string,filter: string) => {
  if (!search) {
    return `No Pokémon matched the selected "${filter}" type filter.`;
  }

  if (!filter) {
    return `No Pokémon matched the search term "${search}".`;
  }

  return `No Pokémon matched the search term "${search}" with the selected "${filter}" type filter.`;
};