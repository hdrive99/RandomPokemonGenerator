using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace RandomPokemonGenerator.Web.Migrations
{
    /// <inheritdoc />
    public partial class CreateTables : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "FormatLists",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormatLists", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "PokemonSets",
                columns: table => new
                {
                    Id = table.Column<int>(type: "int", nullable: false)
                        .Annotation("SqlServer:Identity", "1, 1"),
                    SetName = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Name = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Species = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Item = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    Ability = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MoveOne = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MoveTwo = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MoveThree = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    MoveFour = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    Nature = table.Column<string>(type: "nvarchar(max)", nullable: false),
                    HpEffortValue = table.Column<int>(type: "int", nullable: false),
                    AtkEffortValue = table.Column<int>(type: "int", nullable: false),
                    DefEffortValue = table.Column<int>(type: "int", nullable: false),
                    SpaEffortValue = table.Column<int>(type: "int", nullable: false),
                    SpdEffortValue = table.Column<int>(type: "int", nullable: false),
                    SpeEffortValue = table.Column<int>(type: "int", nullable: false),
                    Gender = table.Column<string>(type: "nvarchar(max)", nullable: true),
                    HpIndividualValue = table.Column<int>(type: "int", nullable: false),
                    AtkIndividualValue = table.Column<int>(type: "int", nullable: false),
                    DefIndividualValue = table.Column<int>(type: "int", nullable: false),
                    SpaIndividualValue = table.Column<int>(type: "int", nullable: false),
                    SpdIndividualValue = table.Column<int>(type: "int", nullable: false),
                    SpeIndividualValue = table.Column<int>(type: "int", nullable: false),
                    Level = table.Column<int>(type: "int", nullable: true),
                    TerastallizeType = table.Column<string>(type: "nvarchar(max)", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_PokemonSets", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "FormatListPokemonSet",
                columns: table => new
                {
                    FormatListsId = table.Column<int>(type: "int", nullable: false),
                    PokemonSetsId = table.Column<int>(type: "int", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_FormatListPokemonSet", x => new { x.FormatListsId, x.PokemonSetsId });
                    table.ForeignKey(
                        name: "FK_FormatListPokemonSet_FormatLists_FormatListsId",
                        column: x => x.FormatListsId,
                        principalTable: "FormatLists",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_FormatListPokemonSet_PokemonSets_PokemonSetsId",
                        column: x => x.PokemonSetsId,
                        principalTable: "PokemonSets",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateIndex(
                name: "IX_FormatListPokemonSet_PokemonSetsId",
                table: "FormatListPokemonSet",
                column: "PokemonSetsId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "FormatListPokemonSet");

            migrationBuilder.DropTable(
                name: "FormatLists");

            migrationBuilder.DropTable(
                name: "PokemonSets");
        }
    }
}
