`timescale 1ps/1ps
`include "hello.v"

module hello_tb;

reg A;
wire F;

hello uut(A,F);

initial begin

    $dumpfile("hello_tb.vcd");
    $dumpvars(0,hello_tb) ;
    A=1'b1;#20;
    A=1'b0;#20;
    A=1'b1;#20;
    A=1'b0;#20;
    A=1'b1;#20;
    A=1'b0;#20;
    $display("completed\n");
    $finish;
end

endmodule