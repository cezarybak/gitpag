import { useState } from "react";
import {
  Navbar,
  Pagination,
  RepoElement,
  SEO,
  UserElement,
} from "../../components";

import { getSearchedItems } from "../../services/getSearchedItems";

import "./style.scss";

export const Home = () => {
  const [activePage, setActivePage] = useState(0);
  const { loading, count, items } = getSearchedItems();

  return (
    <section className="homePage">
      <SEO title="Home - List" metaContent="GitHome Page Content Data" />
      <Navbar />

      <main className="homePage__container">
        <div className="homePage__container__wraper">
          {loading ? (
            <div className="loader" />
          ) : (
            <div className="homePage__container__wraper__list">
              <h1 className="homePage__container__wraper__list__result">
                {count?.toLocaleString()} results
              </h1>
              {items?.map(({ node }) => (
                <div
                  className="homePage__container__wraper__list__element"
                  key={node.id}
                >
                  {node.__typename === "Repository" && (
                    <RepoElement items={node} />
                  )}
                  {node.__typename === "User" && <UserElement items={node} />}
                </div>
              ))}

              <div className="homePage__container__wraper__list__pagination">
                <Pagination
                  activePage={activePage}
                  setActivePage={setActivePage}
                />
              </div>
            </div>
          )}
        </div>
      </main>
    </section>
  );
};
