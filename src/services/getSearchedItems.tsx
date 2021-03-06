import { useApolloClient } from "@apollo/client";
import { useEffect, useState } from "react";
import { SearchList } from "../graphql/operations/queries";
import {
  Repo,
  SearchListData,
  SearchListVars,
  User,
} from "../types/SearchList";
import useDebounce from "../utils/hooks/useDebounce";
import useSearchContext from "../utils/hooks/useSearchContext";

export type DataType = {
  count: number;
  items: { node: User | Repo }[] | [];
};

export const getSearchedItems = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<undefined | DataType>(undefined);

  const { search } = useSearchContext();
  const client = useApolloClient();

  const debounceSearchTerm = useDebounce(search, 600);

  useEffect(() => {
    (async () => {
      setLoading(true);
      Promise.all([
        await client.query<SearchListData, SearchListVars>({
          query: SearchList,
          variables: {
            queryString: debounceSearchTerm || "passion",
            first: 15,
            type: "USER",
          },
        }),

        await client.query<SearchListData, SearchListVars>({
          query: SearchList,
          variables: {
            queryString: debounceSearchTerm || "passion",
            first: 15,
            type: "REPOSITORY",
          },
        }),
      ]).then((e) => {
        setData(
          e
            .map((e) => {
              return {
                count: e.data.search.repositoryCount || e.data.search.userCount,
                items: e.data.search.edges,
              };
            })
            .reduce((prev, next): any => {
              return {
                count: prev.count + next.count,
                items: prev.items
                  .concat(next.items)
                  .sort((a, b) => a.node?.id?.localeCompare(b.node?.id)),
              };
            })
        );
        setLoading(false);
      });
    })();
  }, [debounceSearchTerm]);

  return {
    loading,
    ...data,
  };
};
