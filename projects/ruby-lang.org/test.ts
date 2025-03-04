import { backticks, run, undent } from "brewkit";
import { assertFalse } from "jsr:@std/assert@^1/false";

export default async function () {
  run`ruby -e 'puts "Hello World!"'`;

  // test bundled ruby libraries can be used
  Deno.writeTextFileSync(
    "test.rb",
    undent`
    require 'date'
    puts Date.today`,
  );
  run`ruby ./test.rb`;

  // tests the gems that come with Ruby can be utilized
  Deno.writeTextFileSync(
    "test.rb",
    undent`
    require 'matrix'
    matrix = Matrix[[1, 2], [3, 4]]
    transpose_matrix = matrix.transpose
    determinant = matrix.determinant
    puts "Original matrix:\n#{matrix}"
    puts "Transposed matrix:\n#{transpose_matrix}"
    puts "Determinant of the matrix: #{determinant}"`,
  );
  run`ruby ./test.rb`;

  Deno.writeTextFileSync(
    "test.rb",
    undent`
    def fib(n)
      return n if n <= 1
      fib(n-1) + fib(n-2)
    end
    puts fib(35)`,
  );
  const out = await backticks`ruby --yjit ./test.rb`;
  assertFalse(out.includes("warning"));
}
