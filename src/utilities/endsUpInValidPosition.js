import { calculateFinalPosition } from "./calculateFinalPosition";
import { minTileIndex,maxTileIndex } from "../constants";
import { metadata as rows} from "../components/Map";

export function endsUpInValidPosition(currentPosition,moves){
    const finalPosition = calculateFinalPosition(currentPosition,moves);

    //666碰到地图边缘了
    if(
        finalPosition.rowIndex === -1||
        finalPosition.tileIndex === maxTileIndex + 1 ||
        finalPosition.tileIndex === minTileIndex - 1 )
    {
        return false;
    }

    //666只能站草坪对战
    const finalRow = rows[finalPosition.rowIndex];
    if(
        finalRow &&
        finalRow.type === "road"
    )
    {
        return false;
    }
    return true;
}
 