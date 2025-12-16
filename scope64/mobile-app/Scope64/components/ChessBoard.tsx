import {View, Text, StyleSheet} from "react-native";
import {Chess} from "chess.js";

const FILES = ["a", "b", "c", "d", "e", "f", "g", "h"];

type Props = {
    fen: string;
    flipped?: boolean;
};

export default function ChessBoard({ fen, flipped = false }: Props) {
    const game = new Chess(fen);
    const raw = game.board(); // 8 -> 1

    const board = flipped ? [...raw].reverse().map(r => [...r].reverse()) : raw;

    return (
        <View style={styles.board}>
            {board.map((rank, r) => (
                <View key={r} style={styles.rank}>
                    {rank.map((square, f) => {
                        const isDark = (r + f) % 2 === 1;
                        return (
                            <View
                                key={f}
                                style={[styles.square, isDark ? styles.dark : styles.light]}
                            >
                                {square && <Text style={styles.piece}>{pieceToChar(square)}</Text>}
                            </View>
                        );
                    })}
                </View>
            ))}
        </View>
    );
}


function pieceToChar(p: any) {
    const map: Record<string, string> = {
        p: "♟", r: "♜", n: "♞", b: "♝", q: "♛", k: "♚",
        P: "♙", R: "♖", N: "♘", B: "♗", Q: "♕", K: "♔",
    };
    return map[p.color === "w" ? p.type.toUpperCase() : p.type];
}

const styles = StyleSheet.create({
    board: {aspectRatio: 1},
    rank: {flexDirection: "row", flex: 1},
    square: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
    },
    light: {backgroundColor: "#f0d9b5"},
    dark: {backgroundColor: "#b58863"},
    piece: {fontSize: 28},
});
