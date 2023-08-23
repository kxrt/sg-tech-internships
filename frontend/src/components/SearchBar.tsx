export function SearchBar({
  searchQuery,
  setSearchQuery,
}: {
  searchQuery: string;
  setSearchQuery: (searchQuery: string) => void;
}) {
  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          transition: "0.2s",
        }}
      >
        <input
          type="text"
          placeholder="Search"
          style={{
            width: "50%",
            borderRadius: "10px",
            border: "1px solid #e0e0e0",
            paddingBlock: "1%",
            paddingInline: "2%",
            outline: "none",
            fontSize: "1.2rem",
            fontWeight: "500",
            backgroundColor: "transparent",
          }}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.target.value);
            if (e.target.value != "") {
              e.currentTarget.style.border = "1px solid #6161ff";
            } else {
              e.currentTarget.style.border = "1px solid #e0e0e0";
            }
          }}
          onMouseEnter={(e) => {
            e.preventDefault();
            e.currentTarget.style.border = "1px solid #6161ff";
          }}
          onMouseLeave={(e) => {
            e.preventDefault();
            if (e.currentTarget.value != "") {
              e.currentTarget.style.border = "1px solid #6161ff";
            } else {
              e.currentTarget.style.border = "1px solid #e0e0e0";
            }
          }}
        />
      </div>
    </>
  );
}
