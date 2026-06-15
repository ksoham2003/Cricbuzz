import React from "react";
import { Link } from "react-router";
import Badge from "../../common/Badge";

const FORMAT_VARIANT = {
  ODI: "odi",
  T20I: "t20",
  T20: "t20",
  TEST: "test",
  T10: "t10",
};

const STATUS_VARIANT = {
  LIVE: "live",
  UPCOMING: "upcoming",
  RESULT: "result",
};

const TeamRow = ({ team, isWinner = false }) => (
  <div className="flex items-center justify-between py-1.5">
    <div className="flex items-center gap-2.5">
      <span className="text-xl leading-none">{team.flag}</span>
      <span
        className={`text-sm font-semibold ${
          isWinner ? "text-gray-900" : "text-gray-700"
        }`}
      >
        {team.shortName}
      </span>
    </div>
    <div className="text-right">
      {team.score ? (
        <span
          className={`text-sm font-bold ${
            isWinner ? "text-gray-900" : "text-gray-500"
          }`}
        >
          {team.score}
          {team.overs && (
            <span className="text-xs font-normal text-gray-400 ml-1">
              ({team.overs})
            </span>
          )}
        </span>
      ) : (
        <span className="text-xs text-gray-400 italic">Yet to bat</span>
      )}
    </div>
  </div>
);

const MatchCard = ({ match, className = "" }) => {
  const { format, status, series, team1, team2, note, matchTime, id } = match;

  const isLive = status === "LIVE";
  const isResult = status === "RESULT";

  return (
    <Link
      to={`/matches/${id}`}
      className={[
        "block bg-white rounded-xl border border-gray-100 shadow-sm",
        "hover:border-green-400 hover:shadow-md transition-all duration-200",
        "overflow-hidden group",
        className,
      ]
        .filter(Boolean)
        .join(" ")}
    >
      {/* Card top accent line for LIVE */}
      {isLive && <div className="h-0.5 bg-red-500 w-full" />}

      <div className="p-4">
        {/* Header row */}
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <Badge variant={STATUS_VARIANT[status] || "default"} pulse={isLive}>
              {status}
            </Badge>
            <Badge variant={FORMAT_VARIANT[format] || "default"}>
              {format}
            </Badge>
          </div>
        </div>

        {/* Series name */}
        <p className="text-xs text-gray-400 mb-3 truncate" title={series}>
          {series}
        </p>

        {/* Team rows */}
        <div className="divide-y divide-gray-50">
          <TeamRow
            team={team1}
            isWinner={isResult && team1.score > team2.score}
          />
          <TeamRow
            team={team2}
            isWinner={isResult && team2.score > team1.score}
          />
        </div>

        {/* Divider */}
        <div className="border-t border-dashed border-gray-100 mt-3 pt-2.5">
          {/* Match note or time */}
          <div className="flex items-center justify-between">
            <p
              className={`text-xs font-medium ${
                isLive
                  ? "text-red-500"
                  : isResult
                    ? "text-green-600"
                    : "text-gray-500"
              }`}
            >
              {note}
            </p>
            {matchTime && (
              <span className="text-xs text-gray-400">{matchTime}</span>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
};

export default MatchCard;
