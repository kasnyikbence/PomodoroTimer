import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "timerFormatPipe",
  standalone: true
})
export class TimerFormatPipePipe implements PipeTransform {
  transform(time: number): string {
        const minutes = Math.floor(time / 60);
        const seconds = time % 60;
        return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  }
}
